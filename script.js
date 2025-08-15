const itemInput = document.getElementById('item-input');
const quantityInput = document.getElementById('quantity-input');
const calcBtn = document.getElementById('calc-btn');
const results = document.getElementById('results');
const itemImage = document.getElementById('item-image');
const itemName = document.getElementById('item-name');
const materialsTableBody = document.querySelector('#materials-table tbody');
const totalDiv = document.getElementById('total');

calcBtn.addEventListener('click', () => {
  const itemId = itemInput.value.trim();
  const qty = parseInt(quantityInput.value, 10) || 1;
  if (!itemId) return;
  calculate(itemId, qty);
});

async function calculate(itemId, quantity) {
  try {
    const data = await fetch(`https://gameinfo.albiononline.com/api/gameinfo/items/${itemId}`)
      .then(r => r.json());

    itemImage.src = `https://render.albiononline.com/v1/item/${itemId}.png`;
    itemName.textContent = data.localizedNames?.['ES-ES'] || data.localizedNames?.['EN-US'] || itemId;

    materialsTableBody.innerHTML = '';
    let total = 0;

    const mats = data.craftingRequirements?.craftingItems || [];
    for (const mat of mats) {
      const matId = mat.uniqueName;
      const amount = mat.count * quantity;

      const priceData = await fetch(`https://west.albion-online-data.com/api/v2/stats/prices/${matId}.json?locations=Caerleon`)
        .then(r => r.json());
      const price = priceData[0]?.sell_price_min || 0;
      const subtotal = price * amount;
      total += subtotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="mat-cell">
          <img src="https://render.albiononline.com/v1/item/${matId}.png?size=32" alt="${matId}" />
          <span>${matId}</span>
        </td>
        <td>${amount}</td>
        <td>${price.toLocaleString()}</td>
        <td>${subtotal.toLocaleString()}</td>
      `;
      materialsTableBody.appendChild(row);
    }

    totalDiv.textContent = `Costo total: ${total.toLocaleString()}`;
    results.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    alert('No se pudo obtener información del objeto.');
  }
}