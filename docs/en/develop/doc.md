---
order: 8
icon: jam:write-f
---

# Writing Docs

How to edit the MaaKEDR docs site (VuePress Theme Plume).

## Layout

```text
docs/zh|en/{manual,develop,protocol}/
docs/.vuepress/config/navigation.ts   # navbar + sidebar
```

Add new pages to **both** locale sidebars when applicable.

## Frontmatter

```yaml
---
order: 1
icon: ri:tools-fill
---
```

## Containers

::: tip
Tip box
:::

::: warning
Warning
:::

## Preview

```bash
pnpm docs:dev
pnpm docs:build
```

Keep user manuals aligned with `tasks/*.json`. Keep protocol pages aligned with pipelines. Release notes: update `interface.json` `version` / `title` manually (see `AGENTS.md`).
