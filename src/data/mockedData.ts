const CATEGORIES = ['Electronics', 'Apparel', 'Books', 'Home Goods', 'Sports'];

export const generateMockData = (count = 10000) => {
    const data = [];

    for (let i = 0; i < count; i++) {
        const itemNumber = i + 1;
        const categoryIndex = i % CATEGORIES.length;

        // Create a unique, searchable name/description
        const name = `Widget X-${itemNumber}`;
        let description = `A customizable ${CATEGORIES[categoryIndex].toLowerCase()} component designed for large-scale systems.`;

        // Add variety for complex searches
        if (itemNumber % 10 === 0) {
            description += ' Features proprietary technology for extreme speed and efficiency.';
        }

        data.push({
            id: itemNumber,
            name: name,
            category: CATEGORIES[categoryIndex],
            description: description,
            price: (Math.random() * 1000).toFixed(2),
        });
    }

    console.log(`Successfully generated ${count} items.`);
    return data;
};
