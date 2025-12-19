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

let editId = null;
let deleteId = null;

function showToast(message, type = 'success') {
  toast.innerText = message;

  if(type === 'success') {
    toast.classList.remove('bg-red-500');
    toast.classList.add('bg-green-500');
  } else if(type === 'error') {
    toast.classList.remove('bg-green-500');
    toast.classList.add('bg-red-500');
  }

  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 3000);
}

async function loadData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    table.innerHTML = '';
    data.forEach(item => {
      table.innerHTML += `
        <tr class="hover:bg-gray-50 transition">
          <td class="px-4 py-2">${item.nama}</td>
          <td class="px-4 py-2">${item.jenis}</td>
          <td class="px-4 py-2 text-center">${item.qty}</td>
          <td class="px-4 py-2 text-center">
            <div class="flex justify-center gap-2">
              <button onclick="editItem(${item.id}, '${item.nama}', '${item.jenis}', ${item.qty})"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded shadow transition">Ubah</button>
              <button onclick="showDeleteModal(${item.id})"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded shadow transition">Hapus</button>
            </div>
          </td>
        </tr>
      `;
    });
  } catch (error) {
    showToast('Error load data', 'error');
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  errorMsg.classList.add('hidden');

  const payload = {
    nama: nama.value,
    jenis: jenis.value,
    qty: Number(qty.value)
  };

  try {
    let res;
    let successMsg = '';
    if (editId) {
      res = await fetch(`${API_URL}/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      successMsg = 'Barang berhasil diubah';
    } else {
      res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      successMsg = 'Barang berhasil ditambahkan';
    }

    const result = await res.json();
    if (!res.ok) {
      errorMsg.innerText = result.error || 'Terjadi kesalahan';
      errorMsg.classList.remove('hidden');
      showToast(result.error || 'Terjadi kesalahan', 'error');
      return;
    }

    form.reset();
    editId = null;
    submitBtn.innerText = 'Tambah';
    cancelBtn.classList.add('hidden');

    loadData();
    showToast(successMsg);
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
});

function editItem(id, namaVal, jenisVal, qtyVal) {
  editId = id;
  nama.value = namaVal;
  jenis.value = jenisVal;
  qty.value = qtyVal;

  submitBtn.innerText = 'Simpan Perubahan';
  cancelBtn.classList.remove('hidden');
}

cancelBtn.addEventListener('click', () => {
  form.reset();
  editId = null;
  submitBtn.innerText = 'Tambah';
  cancelBtn.classList.add('hidden');
  errorMsg.classList.add('hidden');
});

const modalDelete = document.getElementById('modalDelete');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');

function showDeleteModal(id) {
  deleteId = id;
  modalDelete.classList.remove('hidden');
}

cancelDelete.addEventListener('click', () => {
  modalDelete.classList.add('hidden');
  deleteId = null;
});

confirmDelete.addEventListener('click', async () => {
  if (!deleteId) return;
  try {
    const res = await fetch(`${API_URL}/${deleteId}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) {
      showToast(result.error || 'Gagal hapus item', 'error');
    } else {
      showToast('Barang berhasil dihapus');
    }
    modalDelete.classList.add('hidden');
    deleteId = null;
    loadData();
  } catch (error) {
    showToast('Error: ' + error.message, 'error');
  }
});

loadData();
