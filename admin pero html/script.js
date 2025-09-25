const $ = (s) => document.querySelector(s)
const $$ = (s) => Array.from(document.querySelectorAll(s))
const showModal = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.classList.remove('hidden')
  el.classList.add('flex')
}
const hideModal = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  el.classList.add('hidden')
  el.classList.remove('flex')
}

document.addEventListener('DOMContentLoaded', () => {
  const notifBtn = document.getElementById('notifBtn')
  if (notifBtn) notifBtn.addEventListener('click', () => showModal('notifModal'))
  const userBtn = document.getElementById('userBtn')
  if (userBtn) userBtn.addEventListener('click', () => showModal('userModal'))
  const dot = document.getElementById('notifDot')
  if (dot) {
    notifBtn?.addEventListener('click', () => dot.remove())
  }

  // Back button support
  const backBtn = document.getElementById('backBtn')
  if (backBtn) {
    if (window.history.length <= 1) backBtn.classList.add('hidden')
    backBtn.addEventListener('click', () => window.history.back())
  }

  // Sidebar toggle (hide/unhide widgets/aside without removing)
  const sidebar = document.querySelector('aside')
  const sidebarToggle = document.getElementById('sidebarToggle')
  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('hidden')
      // Keep layout usable when sidebar hidden
      document.body.classList.toggle('sidebar-hidden')
    })
  }

  // Widgets toggle (areas marked with data-widget)
  const widgetsToggle = document.getElementById('widgetsToggle')
  if (widgetsToggle) {
    widgetsToggle.addEventListener('click', () => {
      document.querySelectorAll('[data-widget]')
        .forEach((el) => el.classList.toggle('hidden'))
      widgetsToggle.textContent =
        widgetsToggle.textContent.includes('Hide') ? 'Show Widgets' : 'Hide Widgets'
    })
  }

  // Highlight active nav link based on current page
  document.querySelectorAll('.nav-link').forEach((a) => {
    try {
      const url = new URL(a.getAttribute('href'), window.location.href)
      if (window.location.pathname.endsWith(url.pathname.split('/').pop() || 'index.html')) {
        a.classList.add('bg-white/10')
      }
    } catch {}
  })

  // Simple data store using localStorage
  const store = {
    get(key, fallback) {
      const raw = localStorage.getItem(key)
      if (!raw) return fallback
      try { return JSON.parse(raw) } catch { return fallback }
    },
    set(key, value) { localStorage.setItem(key, JSON.stringify(value)) }
  }

  // Units: add/edit, search/filter
  if (document.getElementById('unitsTable')) {
    const KEY = 'static_units'
    const initial = store.get(KEY, [
      { id: 1, number: '12A', floor: 12, type: '2BR/2BA', tenant: 'Sarah Johnson', contact: '(555) 123-4567', status: 'Occupied', moveIn: '2023-01-15', rent: 2800 },
      { id: 2, number: '8B', floor: 8, type: '1BR/1BA', tenant: 'Mike Chen', contact: '(555) 234-5678', status: 'Occupied', moveIn: '2023-03-20', rent: 2200 },
      { id: 3, number: '5C', floor: 5, type: '3BR/2BA', tenant: 'Emma Davis', contact: '(555) 345-6789', status: 'Maintenance', moveIn: '', rent: 3200 },
    ])
    if (!localStorage.getItem(KEY)) store.set(KEY, initial)
    let items = store.get(KEY, initial)

    const tbody = document.getElementById('unitsTable')
    const search = document.querySelector('input[placeholder^="Search by unit number"]')
    const statusSel = document.querySelector('select')

    function badge(status){
      const map = { Occupied: 'bg-emerald-100 text-emerald-700', Maintenance: 'bg-amber-100 text-amber-700', Available: 'bg-blue-100 text-blue-700', Reserved: 'bg-indigo-100 text-indigo-700' }
      return `<span class="rounded-full px-2 py-0.5 text-xs ${map[status]||'bg-slate-100 text-slate-700'}">${status}</span>`
    }

    function render(){
      let list = items
      const q = (search?.value || '').toLowerCase()
      if (q) {
        list = list.filter(u => u.number.toLowerCase().includes(q) || (u.tenant||'').toLowerCase().includes(q) || u.type.toLowerCase().includes(q))
      }
      const f = statusSel?.value
      if (f && f !== 'All Status') list = list.filter(u => u.status === f)
      tbody.innerHTML = list.map(u => `
        <tr class="border-t">
          <td class="p-2 font-semibold">${u.number}</td>
          <td class="p-2">${u.floor}</td>
          <td class="p-2">${u.type}</td>
          <td class="p-2">${u.tenant || '<span class=\"text-slate-400\">Vacant</span>'}</td>
          <td class="p-2">${u.contact || '-'}</td>
          <td class="p-2">${badge(u.status)}</td>
          <td class="p-2">${u.moveIn || '-'}</td>
          <td class="p-2 font-medium">$${Number(u.rent).toLocaleString()}</td>
        </tr>
      `).join('')
    }
    search?.addEventListener('input', render)
    statusSel?.addEventListener('change', render)
    render()

    // Add Unit modal handlers
    const addBtn = document.getElementById('addUnitBtn')
    addBtn?.addEventListener('click', () => showModal('unitModal'))
    const saveBtn = document.getElementById('saveUnitBtn')
    saveBtn?.addEventListener('click', () => {
      const newItem = {
        id: Date.now(),
        number: document.getElementById('u-number').value.trim(),
        floor: Number(document.getElementById('u-floor').value || 0),
        type: document.getElementById('u-type').value.trim() || 'Studio',
        tenant: document.getElementById('u-tenant').value.trim() || null,
        contact: document.getElementById('u-contact').value.trim() || null,
        status: document.getElementById('u-status').value,
        moveIn: document.getElementById('u-movein').value,
        rent: Number(document.getElementById('u-rent').value || 0),
      }
      if (!newItem.number) { alert('Unit number is required'); return }
      items = [newItem, ...items]
      store.set(KEY, items)
      hideModal('unitModal')
      render()
    })
  }

  // Complaints basic list actions (view alert placeholder)
  if (document.location.pathname.endsWith('complaints.html')) {
    const CKEY = 'static_complaints'
    if (!localStorage.getItem(CKEY)) {
      store.set(CKEY, [{ id: 1, unit: '12A', tenant: 'Sarah Johnson', category: 'Plumbing', title: 'Kitchen sink leaking', priority: 'High', status: 'Pending' }])
    }
    const addBtn = document.getElementById('addComplaintBtn')
    addBtn?.addEventListener('click', () => showModal('complaintModal'))
    const saveBtn = document.getElementById('saveComplaintBtn')
    saveBtn?.addEventListener('click', () => {
      const item = {
        id: Date.now(),
        unit: document.getElementById('c-unit').value.trim(),
        tenant: document.getElementById('c-tenant').value.trim(),
        category: document.getElementById('c-category').value.trim(),
        title: document.getElementById('c-title').value.trim(),
        priority: 'High', status: 'Pending'
      }
      if (!item.unit || !item.title) { alert('Unit and Title are required'); return }
      const items = store.get(CKEY, [])
      items.unshift(item)
      store.set(CKEY, items)
      hideModal('complaintModal')
      alert('Complaint added')
    })
  }

  // Requests add/save using localStorage
  if (document.location.pathname.endsWith('requests.html')) {
    const RKEY = 'static_requests'
    if (!localStorage.getItem(RKEY)) {
      store.set(RKEY, [{ id: 2, unit: '8B', tenant: 'Mike Chen', type: 'Amenity', title: 'Pool area reservation', status: 'Approved' }])
    }
    document.getElementById('addRequestBtn')?.addEventListener('click', () => showModal('requestModal'))
    document.getElementById('saveRequestBtn')?.addEventListener('click', () => {
      const item = {
        id: Date.now(),
        unit: document.getElementById('r-unit').value.trim(),
        tenant: document.getElementById('r-tenant').value.trim(),
        type: document.getElementById('r-type').value.trim(),
        title: document.getElementById('r-title').value.trim(),
        status: 'Pending'
      }
      if (!item.unit || !item.title) { alert('Unit and Title are required'); return }
      const items = store.get(RKEY, [])
      items.unshift(item)
      store.set(RKEY, items)
      hideModal('requestModal')
      alert('Request added')
    })
  }

  // Settings persistence
  if (document.location.pathname.endsWith('settings.html')) {
    const SKEY = 'static_settings'
    const current = store.get(SKEY, {})
    // General fields
    const sysName = document.querySelector('#tab-general input')
    if (sysName && current.systemName) sysName.value = current.systemName
    $$('#tab-general button').forEach(btn => btn.addEventListener('click', () => {
      store.set(SKEY, { ...store.get(SKEY, {}), systemName: sysName?.value })
      alert('General settings saved')
    }))
    $$('#tab-notifications button').forEach(btn => btn.addEventListener('click', () => {
      const email = document.querySelector('#tab-notifications input[type=checkbox]')?.checked
      store.set(SKEY, { ...store.get(SKEY, {}), notifyEmail: email })
      alert('Notification settings saved')
    }))
    $$('#tab-users button').forEach(btn => btn.addEventListener('click', () => {
      const name = document.querySelector('#tab-users input')?.value
      store.set(SKEY, { ...store.get(SKEY, {}), adminName: name })
      alert('User settings saved')
    }))
    $$('#tab-property button').forEach(btn => btn.addEventListener('click', () => {
      const prop = document.querySelector('#tab-property input')?.value
      store.set(SKEY, { ...store.get(SKEY, {}), propertyName: prop })
      alert('Property settings saved')
    }))
    $$('#tab-security button').forEach(btn => btn.addEventListener('click', () => {
      const complex = document.querySelector('#tab-security input[type=checkbox]')?.checked
      store.set(SKEY, { ...store.get(SKEY, {}), requireComplex: complex })
      alert('Security settings saved')
    }))
  }
})


