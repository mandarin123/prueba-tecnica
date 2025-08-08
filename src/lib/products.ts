// Static product list
export const products = [
  { 
    id: 1, 
    name: "White T-shirt", 
    price: 60, 
    img: "/img/white-tshirt.jpg"
  },
  { 
    id: 2, 
    name: "Sweatshirt", 
    price: 100, 
    img: "/img/sweatshirt.jpg"
  },
  { 
    id: 3, 
    name: "Trousers", 
    price: 120, 
    img: "/img/trousers.jpeg"
  },
  { 
    id: 4, 
    name: "Jacket", 
    price: 70, 
    img: "/img/jacket.jpg"
  },
];

// Function to find the best product combination within budget (one unit per product)
export function findBestCombination(products: { id: number; name: string; price: number }[], budget: number) {
  let bestCombination: typeof products = [];
  let bestTotal = 0;

  // Recursive function to test combinations
  function findCombination(current: typeof products, index: number, currentTotal: number) {
    if (currentTotal > budget) return;
    
    if (currentTotal > bestTotal) {
      bestTotal = currentTotal;
      bestCombination = [...current];
    }

    for (let i = index; i < products.length; i++) {
      current.push(products[i]);
      findCombination(current, i + 1, currentTotal + products[i].price);
      current.pop();
    }
  }

  findCombination([], 0, 0);
  return bestCombination;
}

// Function to find the best product combination considering product counts
export function findBestCombinationWithCounts(
  products: { id: number; name: string; price: number; count: number }[],
  budget: number
) {
  // Expand each product according to its count
  const expanded: { id: number; name: string; price: number }[] = [];
  for (const p of products) {
    for (let i = 0; i < p.count; i++) {
      expanded.push({ id: p.id, name: p.name, price: p.price });
    }
  }
  // Use the original function to find the best combination
  return findBestCombination(expanded, budget);
}

