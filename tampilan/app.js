const API_URL = 'http://localhost:5000/api/atk';

const form = document.getElementById('atkForm');
const table = document.getElementById('atkTable');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const errorMsg = document.getElementById('errorMsg');

const nama = document.getElementById('nama');
const jenis = document.getElementById('jenis');
const qty = document.getElementById('qty');
const toast = document.getElementById('toast');

const modalDelete = document.getElementById('modalDelete');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

let editId = null;
let deleteId = null;

/* TOAST */
function showToast(message, type = 'success') {
  toast.innerText = message;
  toast.className = 'fixed top-5 right-5 px-4 py-2 rounded shadow text-white transition ' + (type === 'success' ? 'bg-green-500' : 'bg-red-500');

  toast.classList.remove('opacity-0');
  setTimeout(() => toast.classList.add('opacity-0'), 3000);
}

/* LOAD DATA */
async function loadData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  table.innerHTML = '';
  data.forEach((item) => {
    table.innerHTML += `
      <tr>
        <td class="px-4 py-2">${item.nama}</td>
        <td class="px-4 py-2">${item.jenis}</td>
        <td class="px-4 py-2 text-center">${item.qty}</td>
        <td class="px-4 py-2">
          <div class="flex justify-center gap-2">
            <button
              onclick="editItem(${item.id}, '${item.nama}', '${item.jenis}', ${item.qty})"
              class="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Ubah
            </button>
            <button
              onclick="showDeleteModal(${item.id})"
              class="bg-red-600 text-white px-3 py-1 rounded"
            >
              Hapus
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}

/* SUBMIT FORM */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    nama: nama.value,
    jenis: jenis.value,
    qty: Number(qty.value),
  };

  const method = editId ? 'PUT' : 'POST';
  const url = editId ? `${API_URL}/${editId}` : API_URL;

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  if (!res.ok) {
    showToast(result.error || 'Terjadi kesalahan', 'error');
    return;
  }

  showToast(editId ? 'Barang berhasil diubah' : 'Barang berhasil ditambahkan');

  form.reset();
  editId = null;
  submitBtn.innerText = 'Tambah';
  cancelBtn.classList.add('hidden');

  loadData();
});

/* EDIT */
function editItem(id, n, j, q) {
  editId = id;
  nama.value = n;
  jenis.value = j;
  qty.value = q;

  submitBtn.innerText = 'Simpan';
  cancelBtn.classList.remove('hidden');
}

/* CANCEL */
cancelBtn.onclick = () => {
  form.reset();
  editId = null;
  submitBtn.innerText = 'Tambah';
  cancelBtn.classList.add('hidden');
};

window.showDeleteModal = function (id) {
  deleteId = id;
  modalDelete.classList.remove('hidden');
};

cancelDelete.onclick = () => {
  modalDelete.classList.add('hidden');
  deleteId = null;
};

confirmDelete.onclick = async () => {
  if (!deleteId) return;

  await fetch(`${API_URL}/${deleteId}`, { method: 'DELETE' });
  showToast('Barang berhasil dihapus');

  modalDelete.classList.add('hidden');
  deleteId = null;
  loadData();
};

/* INIT */
loadData();
