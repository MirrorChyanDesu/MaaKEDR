from typing import Any

from maa.agent.agent_server import AgentServer
from maa.context import Context
from maa.custom_recognition import CustomRecognition
from maa.define import RectType
from maa.pipeline import JOCR, JRecognitionType
from utils.logger import logger
from utils.params import parse_params


@AgentServer.custom_recognition("ReadPVPResult")
class ReadPVPResult(CustomRecognition):
    """读取PVP战斗结果"""

    def analyze(
        self, context: Context, argv: CustomRecognition.AnalyzeArg
    ) -> CustomRecognition.AnalyzeResult | RectType | None:
        params = parse_params(argv.custom_recognition_param)

        current_score_roi = params.get("current_score_roi", [500, 300, 200, 60])
        score_change_roi = params.get("score_change_roi", [710, 300, 100, 60])
        current_rank_roi = params.get("current_rank_roi", [500, 400, 200, 60])
        rank_change_roi = params.get("rank_change_roi", [710, 400, 100, 60])

        image = argv.image

        # 识别当前积分
        current_score_detail = context.run_recognition_direct(
            JRecognitionType.OCR,
            JOCR(roi=current_score_roi, only_rec=True),
            image,
        )
        current_score = self._extract_number(current_score_detail)

        # 识别积分变化
        score_change_detail = context.run_recognition_direct(
            JRecognitionType.OCR,
            JOCR(roi=score_change_roi, only_rec=True),
            image,
        )
        score_change = self._extract_number(score_change_detail)

        # 识别当前排名
        current_rank_detail = context.run_recognition_direct(
            JRecognitionType.OCR,
            JOCR(roi=current_rank_roi, only_rec=True),
            image,
        )
        current_rank = self._extract_number(current_rank_detail)

        # 识别排名变化
        rank_change_detail = context.run_recognition_direct(
            JRecognitionType.OCR,
            JOCR(roi=rank_change_roi, only_rec=True),
            image,
        )
        rank_change = self._extract_number(rank_change_detail)

        # 判断胜负
        result_text = "胜利" if score_change > 0 else "失败"

        # 显示结果
        logger.info("[PVP战斗结果] {}", result_text)
        logger.info("[当前积分] {} ({}{})", current_score, "+" if score_change > 0 else "", score_change)
        logger.info("[当前排名] {} ({}{})", current_rank, "+" if rank_change > 0 else "", rank_change)

        return CustomRecognition.AnalyzeResult(box=(0, 0, 1, 1), detail={})

    def _extract_number(self, ocr_detail: Any) -> int:
        """从OCR结果中提取数字"""
        if not ocr_detail or not ocr_detail.all_results:
            return 0

        try:
            text = ocr_detail.all_results[0].text.strip()  # pyright: ignore
            # 保留数字和正负号
            number_str = ''.join(c for c in text if c.isdigit() or c in ['-', '+'])
            return int(number_str) if number_str else 0
        except (ValueError, AttributeError):
            return 0
