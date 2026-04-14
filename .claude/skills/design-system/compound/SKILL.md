# Design System — Compound Patterns

## DataList
```
DataList
  DataList.Header (title + actions)
  DataList.Filters (search + filter controls)
  DataList.Body
    DataList.Item (repeated)
    DataList.EmptyState
    DataList.LoadingState
```

## Form
```
Form (handles submission + validation state)
  Form.Field (label + input + error)
  Form.Section (grouped fields)
  Form.Actions (submit + cancel)
```

## PageLayout
```
PageLayout
  PageLayout.Header (title + breadcrumb + actions)
  PageLayout.Content (main area)
  PageLayout.Sidebar (optional)
```

## Tabs
```
Tabs (manages active state)
  Tabs.List (tab triggers)
    Tabs.Trigger (individual tab)
  Tabs.Panels
    Tabs.Panel (tab content)
```

Use compound components only when 3+ tightly related sub-components share state.
