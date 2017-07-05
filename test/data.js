// () => object
function get() {
    return {
        items: [
            {
                title: 'Product A-1',
                brand: 'Brand A',
                price: '9.90',
                url: '/products/a-1.html',
                imageUrl: '/images/products/a-1.jpg',
                isAvailable: true,
                mods: '_av'
            },
            {
                title: 'Product Z-2',
                brand: 'Brand Z',
                url: '/products/z-2.html',
                isAvailable: false,
                mods: '_na'
            }
        ]
    };
}

module.exports = {
    get
};
