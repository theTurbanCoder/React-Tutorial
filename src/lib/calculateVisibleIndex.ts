
const ROW_HEIGHT = 80;
const OVERSCAN_COUNT = 5; // Buffer zones


export const calculateVisibleIndex = ({scrollTop, height, itemsLength}:{scrollTop: number, height: number, itemsLength:number}) => {


    const startIndex = Math.max(
        0,
        Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_COUNT
    );


    const endIndex = Math.min(
        itemsLength - 1,
        Math.ceil((scrollTop + height) / ROW_HEIGHT) + OVERSCAN_COUNT
    );


    // 3. The initial pixel offset (transformY) for the first visible item
    const offset = startIndex * ROW_HEIGHT;

    return {startIndex, endIndex, offset}
}