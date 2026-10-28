const products = [
  { id: 1, name: 'Keyboard', price: 1500, archived: false },
  { id: 2, name: 'Mouse', price: 700, archived: true },
  { id: 3, name: 'Monitor', price: 9000 },
];

function getActiveProducts(list) {
  return list.filter((p) => p.archived !== true);
}

function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

function findProductName(id) {
  const product = products.find((p) => p.id === id);
  return product ? product.name : 'Not found';
}

const active = getActiveProducts(products);
console.log('Active:', active.length);
console.log('Total:', calculateTotal(active));
console.log('Product 9:', findProductName(9));