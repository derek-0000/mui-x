---
productId: x-tree-view
title: Rich Tree View - Expansion
components: RichTreeView, TreeItem
packageName: '@mui/x-tree-view'
githubLabel: 'component: tree view'
waiAria: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
---

# Rich Tree View - Expansion

<p class="description">Handle how users can expand items.</p>

## Controlled expansion

Use the `expandedItems` prop to control the expanded items.

You can use the `onExpandedItemsChange` prop to listen to changes in the expanded items and update the prop accordingly.

{{"demo": "ControlledExpansion.js"}}

:::info

- The expansion is **controlled** when its parent manages it by providing a `expandedItems` prop.
- The expansion is **uncontrolled** when it is managed by the component's own internal state. This state can be initialized using the `defaultExpandedItems` prop.

Learn more about the _Controlled and uncontrolled_ pattern in the [React documentation](https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components).
:::

## Track item expansion change

Use the `onItemExpansionToggle` prop if you want to react to an item expansion change:

{{"demo": "TrackItemExpansionToggle.js"}}

## Change item expansion

You can use the `setItemExpansion` API method to imperatively change the expansion of an item:

{{"demo": "ChangeItemExpansion.js"}}
