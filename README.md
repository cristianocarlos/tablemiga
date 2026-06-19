```css
@source '../../node_modules/@cristianocarlos/tablemiga/dist/**/*.{js}';

@theme {
    --color-tablemiga--theme: #0066b4;
}

@utility tablemiga--no-wrap {
    @apply overflow-hidden text-ellipsis whitespace-nowrap;
}

@utility tablemiga--head-sticky {
    @apply sticky top-0;
    z-index: 2;
}

@utility tablemiga--z-table-head-sticky {
    z-index: 2;
}
```
