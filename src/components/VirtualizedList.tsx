import React, { memo, useCallback, useRef, useState } from 'react'
import { useScrollEffect } from '../hooks/useScrollEffect';
import { calculateVisibleIndex } from '../lib/calculateVisibleIndex';


const ROW_HEIGHT = 80;
const LIST_HEIGHT = 600;


const Row = memo(({ item }: {
    item: {
        id: number;
        name: string;
        category: string;
        description: string;
        price: string;
    }
}) => (
    <div
        key={item.id} style={{ height: `${ROW_HEIGHT}px`, padding: '10px 15px', borderBottom: '1px solid #eee' }}
    >
        <span style={{ fontWeight: 'bold' }}>{item.name}</span>
        <span style={{ float: 'right', color: '#666' }}>{item.category}</span>
        <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#888' }}>
            {item.description.substring(0, 80)}...
        </p>
    </div>
));

export const VirtualizedList = ({ items }: {
    items: {
        id: number;
        name: string;
        category: string;
        description: string;
        price: string;
    }[]
}) => {


    const totalHeight = LIST_HEIGHT


    const parentRef = useRef<HTMLDivElement>(null);
    const lastElementRef = useRef<HTMLDivElement>(null)


    const [scrollTop, setScrollTop] = useState(0)


    const handleScrollToEnd =useCallback( () => {

        lastElementRef.current?.lastElementChild?.scrollIntoView({
            behavior:'smooth',
            block:'start',
            inline:'end'
        })

    }, [lastElementRef])

   useScrollEffect<HTMLDivElement>({ parentRef: parentRef, setScrollTop })

    const { startIndex, endIndex, offset } = calculateVisibleIndex({ scrollTop, height: totalHeight, itemsLength: items.length })

    const visibleItems = items.slice(startIndex, endIndex + 1);

    return (
        <>
        <button onClick={handleScrollToEnd}> scroll To end </button>

        <div ref={parentRef} className="virtualized-container" style={{
            height: `${LIST_HEIGHT}px`,
            width: '800px',
            overflow: 'auto', // MUST be scrollable
            border: '1px solid #ddd',
            overscrollBehaviorBlock:"contain"
        }}>

            <div
                style={{ height: `${totalHeight}px`, position: 'relative', width: '100%' }}

            >
                <div ref={lastElementRef} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${offset}px)`,
                    willChange: 'transform',
                }}>{visibleItems.map((item) => <div>

                    {<Row key={item.id} item={item}></Row>}
                </div>)}</div>
            </div>
        </div>
        </>
    )
}

