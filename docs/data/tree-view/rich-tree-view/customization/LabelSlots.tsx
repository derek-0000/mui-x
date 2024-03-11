import * as React from 'react';
import {
  TreeItem2,
  TreeItem2Label,
  TreeItem2Props,
} from '@mui/x-tree-view/TreeItem2';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import {
  UseTreeItem2ContentSlotOwnProps,
  useTreeItem2Utils,
} from '@mui/x-tree-view';

interface CustomLabelProps {
  children: string;
  className: string;
  onChange: (value: string) => void;
}

function CustomLabel(props: CustomLabelProps) {
  const { children, onChange, ...other } = props;

  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [value, setValue] = React.useState('');
  const editingLabelRef = React.useRef<HTMLInputElement>(null);

  const handleLabelDoubleClick = () => {
    setIsEditing(true);
    setValue(children);
  };

  const handleEditingLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleEditingLabelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.stopPropagation();
      setIsEditing(false);
      onChange(value);
    } else if (event.key === 'Escape') {
      event.stopPropagation();
      setIsEditing(false);
    }
  };

  React.useEffect(() => {
    if (isEditing) {
      editingLabelRef.current?.focus();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <input
        value={value}
        onChange={handleEditingLabelChange}
        onKeyDown={handleEditingLabelKeyDown}
        ref={editingLabelRef}
      />
    );
  }

  return (
    <TreeItem2Label {...other} onDoubleClick={handleLabelDoubleClick}>
      {children}
    </TreeItem2Label>
  );
}

const TreeItemContext = React.createContext<{
  onLabelValueChange: (nodeId: string, label: string) => void;
}>({ onLabelValueChange: () => {} });

const CustomTreeItem = React.forwardRef(
  (props: TreeItem2Props, ref: React.Ref<HTMLLIElement>) => {
    const { interactions } = useTreeItem2Utils({
      nodeId: props.nodeId,
      children: props.children,
    });

    const { onLabelValueChange } = React.useContext(TreeItemContext);

    const handleLabelValueChange = (newLabel: string) => {
      onLabelValueChange(props.nodeId, newLabel);
    };

    const handleContentClick: UseTreeItem2ContentSlotOwnProps['onClick'] = (
      event,
    ) => {
      event.defaultMuiPrevented = true;
      interactions.handleSelection(event);
    };

    const handleIconContainerClick = (event: React.MouseEvent) => {
      interactions.handleExpansion(event);
    };

    return (
      <TreeItem2
        ref={ref}
        {...props}
        slots={{
          label: CustomLabel,
        }}
        slotProps={{
          content: { onClick: handleContentClick },
          iconContainer: { onClick: handleIconContainerClick },
          label: {
            onChange: handleLabelValueChange,
          } as any,
        }}
      />
    );
  },
);

const DEFAULT_MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
];

const DEFAULT_EXPANDED_NODES = ['pickers'];

export default function LabelSlots() {
  const [products, setProducts] = React.useState(DEFAULT_MUI_X_PRODUCTS);

  const context = React.useMemo(
    () => ({
      onLabelValueChange: (nodeId: string, label: string) =>
        setProducts((prev) => {
          const walkTree = (item: TreeViewBaseItem): TreeViewBaseItem => {
            if (item.id === nodeId) {
              return { ...item, label };
            }
            if (item.children) {
              return { ...item, children: item.children.map(walkTree) };
            }

            return item;
          };

          return prev.map(walkTree);
        }),
    }),
    [],
  );

  return (
    <TreeItemContext.Provider value={context}>
      <RichTreeView
        items={products}
        aria-label="customized"
        defaultExpandedNodes={DEFAULT_EXPANDED_NODES}
        sx={{ overflowX: 'hidden', minHeight: 224, flexGrow: 1, maxWidth: 300 }}
        slots={{ item: CustomTreeItem }}
      />
    </TreeItemContext.Provider>
  );
}