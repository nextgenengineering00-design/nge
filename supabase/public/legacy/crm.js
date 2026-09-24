(() => {
  'use strict';

  const config = window.NGE_CONFIG || {};
  const supabaseUrl = String(config.supabaseUrl || '').trim();
  const publicKey = String(config.supabasePublishableKey || config.supabaseAnonKey || '').trim();
  const isConfigured = Boolean(supabaseUrl && publicKey);
  const pageSize = 50;
  const exportLimit = 10000;
  const activeStatuses = ['new', 'contacted', 'qualified'];
  const closedStatuses = ['won', 'lost', 'spam'];
  const allowedRoles = ['crm_admin', 'crm_staff'];
  const statusLabels = { new: 'ลูกค้าใหม่', contacted: 'ติดต่อแล้ว', qualified: 'ประเมินงาน', won: 'ปิดงานสำเร็จ', lost: 'ไม่ดำเนินการ', spam: 'สแปม' };
  const priorityLabels = { low: 'ต่ำ', normal: 'ปกติ', high: 'สำคัญ', urgent: 'ด่วน' };
  const queueLabels = { all: 'แสดงลูกค้าทั้งหมด', new: 'คิวลูกค้าใหม่ที่รอติดต่อ', today: 'คิวที่ต้องติดตามภายในวันนี้', overdue: 'คิวติดตามที่เกินกำหนด', unassigned: 'คิวที่ยังไม่มีผู้รับผิดชอบ', urgent: 'คิวงานด่วน' };
  const activityLabels = { status_changed: 'เปลี่ยนสถานะ', owner_changed: 'เปลี่ยนผู้รับผิดชอบ', follow_up_changed: 'เปลี่ยนวันติดตาม', contact_recorded: 'บันทึกการติดต่อ', lead_updated: 'แก้ไขข้อมูล' };
  const leadColumns = 'id,created_at,updated_at,name,phone,email,service,location,budget,message,status,internal_note,next_follow_up_at,last_contacted_at,first_response_at,closed_at,assigned_to,priority,lead_score,auto_priority_reason,lost_reason,page_path,referrer_host,utm_source,utm_medium,utm_campaign,utm_content,utm_term';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const els = {
    sidebar: $('#crmSidebar'), mobileMenu: $('#mobileMenuButton'), setupBanner: $('#setupBanner'), loginView: $('#loginView'),
    accessDenied: $('#accessDeniedView'), deniedSignOut: $('#deniedSignOutButton'), dashboardView: $('#dashboardView'),
    loginForm: $('#loginForm'), loginStatus: $('#loginStatus'), signOut: $('#signOutButton'), accountName: $('#accountName'),
    liveDot: $('#liveDot'), liveText: $('#liveText'), lastUpdated: $('#lastUpdated'), leadRows: $('#leadRows'),
    emptyState: $('#emptyState'), search: $('#leadSearch'), statusFilter: $('#statusFilter'), ownerFilter: $('#ownerFilter'),
    serviceFilter: $('#serviceFilter'), sourceFilter: $('#sourceFilter'), clearFilters: $('#clearFiltersButton'),
    refresh: $('#refreshButton'), export: $('#exportButton'), resultCount: $('#resultCount'), pageSummary: $('#pageSummary'),
    pipeline: $('#pipelineGrid'), activeQueueText: $('#activeQueueText'), queueTabs: $('#queueTabs'), pagination: $('#pagination'),
    prevPage: $('#prevPageButton'), nextPage: $('#nextPageButton'), pageNumber: $('#pageNumber'),
    metricNew: $('#metricNew'), metricActive: $('#metricActive'), metricToday: $('#metricToday'), metricOverdue: $('#metricOverdue'),
    metricUnassigned: $('#metricUnassigned'), metricUrgent: $('#metricUrgent'), metricSla: $('#metricSla'), metricWon: $('#metricWon'),
    dialog: $('#leadDialog'), detailId: $('#detailId'), detailName: $('#detailName'), detailMeta: $('#detailMeta'),
    detailPhone: $('#detailPhone'), detailPhoneText: $('#detailPhoneText'), detailEmail: $('#detailEmail'), detailEmailText: $('#detailEmailText'),
    detailService: $('#detailService'), detailLocation: $('#detailLocation'), detailBudget: $('#detailBudget'), detailSource: $('#detailSource'), detailScore: $('#detailScore'),
    detailMessage: $('#detailMessage'), detailStatus: $('#detailStatus'), detailPriority: $('#detailPriority'), detailOwner: $('#detailOwner'),
    detailFollowup: $('#detailFollowup'), lostReasonField: $('#lostReasonField'), detailLostReason: $('#detailLostReason'),
    detailNote: $('#detailNote'), markContacted: $('#markContacted'), copyPhone: $('#copyPhoneButton'), save: $('#saveLeadButton'),
    editorStatus: $('#editorStatus'), activityList: $('#activityList'), toast: $('#crmToast')
  };

  let client = null;
  let leads = [];
  let profiles = [];
  let metrics = {};
  let realtimeChannel = null;
  let reloadTimer = null;
  let toastTimer = null;
  let searchTimer = null;
  let dashboardUserId = null;
  let currentPage = 0;
  let totalRows = 0;
  let activeQueue = 'all';
  let currentLead = null;

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  const normalize = value => String(value || '').toLocaleLowerCase('th-TH');
  const cleanSearch = value => String(value || '').replace(/[,()%_*]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
  const thaiDate = value => value ? new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
  const thaiShortDate = value => value ? new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : 'ยังไม่กำหนด';
  const inputDate = value => value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
  const sourceLabel = lead => lead.utm_source || lead.referrer_host || (lead.page_path?.includes('booking') ? 'Booking' : 'เว็บไซต์');
  const ownerName = id => profiles.find(profile => profile.user_id === id)?.display_name || (id ? 'ผู้ใช้ CRM' : 'ยังไม่มอบหมาย');
  const activityActorName = id => id ? ownerName(id) : 'ระบบ';
  const startOfToday = () => { const date = new Date(); date.setHours(0, 0, 0, 0); return date; };
  const endOfToday = () => { const date = new Date(); date.setHours(23, 59, 59, 999); return date; };

  function showToast(message, type = '') {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.className = `crm-toast show ${type}`.trim();
    toastTimer = setTimeout(() => { els.toast.className = 'crm-toast'; }, 3200);
  }

  function setConnection(state, text) {
    els.liveDot.className = `live-dot ${state}`.trim();
    els.liveText.textContent = text;
  }

  function setBusy(isBusy) {
    els.refresh.disabled = isBusy;
    els.export.disabled = isBusy;
    els.refresh.textContent = isBusy ? 'กำลังโหลด…' : '↻ รีเฟรช';
  }

  function updateOwnerOptions() {
    const ownerValue = els.ownerFilter.value;
    const detailValue = els.detailOwner.value;
    const options = profiles.map(profile => `<option value="${escapeHtml(profile.user_id)}">${escapeHtml(profile.display_name)}</option>`).join('');
    els.ownerFilter.innerHTML = '<option value="">ทุกคน</option><option value="unassigned">ยังไม่มอบหมาย</option>' + options;
    els.detailOwner.innerHTML = '<option value="">ยังไม่มอบหมาย</option>' + options;
    if ([...els.ownerFilter.options].some(option => option.value === ownerValue)) els.ownerFilter.value = ownerValue;
    if ([...els.detailOwner.options].some(option => option.value === detailValue)) els.detailOwner.value = detailValue;
  }

  function updateFilterOptions(payload) {
    const serviceValue = els.serviceFilter.value;
    const sourceValue = els.sourceFilter.value;
    const services = Array.isArray(payload?.services) ? payload.services.filter(Boolean) : [];
    const sources = Array.isArray(payload?.sources) ? payload.sources.filter(item => item?.value && item?.label) : [];
    els.serviceFilter.innerHTML = '<option value="">ทุกประเภทงาน</option>' + services.map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join('');
    els.sourceFilter.innerHTML = '<option value="">ทุกช่องทาง</option>' + sources.map(item => `<option value="${escapeHtml(item.value)}">${escapeHtml(item.label)}</option>`).join('');
    if ([...els.serviceFilter.options].some(option => option.value === serviceValue)) els.serviceFilter.value = serviceValue;
    if ([...els.sourceFilter.options].some(option => option.value === sourceValue)) els.sourceFilter.value = sourceValue;
  }

  function applyLeadFilters(query) {
    const search = cleanSearch(els.search.value);
    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%,location.ilike.%${search}%,service.ilike.%${search}%`);
    if (els.statusFilter.value) query = query.eq('status', els.statusFilter.value);
    if (els.serviceFilter.value) query = query.eq('service', els.serviceFilter.value);
    if (els.ownerFilter.value === 'unassigned') query = query.is('assigned_to', null);
    else if (els.ownerFilter.value) query = query.eq('assigned_to', els.ownerFilter.value);
    const source = els.sourceFilter.value;
    if (source.startsWith('utm:')) query = query.eq('utm_source', source.slice(4));
    else if (source.startsWith('ref:')) query = query.eq('referrer_host', source.slice(4)).is('utm_source', null);
    else if (source === 'website') query = query.is('utm_source', null).is('referrer_host', null);

    const todayStart = startOfToday().toISOString();
    const todayEnd = endOfToday().toISOString();
    if (activeQueue === 'new') query = query.eq('status', 'new');
    if (activeQueue === 'today') query = query.gte('next_follow_up_at', todayStart).lte('next_follow_up_at', todayEnd).not('status', 'in', '(won,lost,spam)');
    if (activeQueue === 'overdue') query = query.lt('next_follow_up_at', todayStart).not('status', 'in', '(won,lost,spam)');
    if (activeQueue === 'unassigned') query = query.is('assigned_to', null).in('status', activeStatuses);
    if (activeQueue === 'urgent') query = query.eq('priority', 'urgent').in('status', activeStatuses);
    return query;
  }

  function rowFollowupClass(lead) {
    if (!lead.next_follow_up_at || closedStatuses.includes(lead.status)) return '';
    const time = new Date(lead.next_follow_up_at).getTime();
    if (time < startOfToday().getTime()) return 'is-overdue';
    if (time <= endOfToday().getTime()) return 'is-today';
    return '';
  }

  function renderRows() {
    els.resultCount.textContent = totalRows.toLocaleString('th-TH');
    els.emptyState.hidden = leads.length > 0;
    els.leadRows.innerHTML = leads.map(lead => {
      const followupClass = rowFollowupClass(lead);
      return `<tr class="${lead.priority === 'urgent' ? 'row-urgent' : ''}">
        <td><span class="customer-name"><b>${escapeHtml(lead.name)}</b><small>${escapeHtml(lead.location || 'ไม่ระบุพื้นที่')} · ${escapeHtml(sourceLabel(lead))}</small></span></td>
        <td><span class="contact-stack"><a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a><a class="email-link" href="${lead.email ? `mailto:${escapeHtml(lead.email)}` : '#'}">${escapeHtml(lead.email || 'ไม่มีอีเมล')}</a></span></td>
        <td><span class="service-stack"><b>${escapeHtml(lead.service || '—')}</b><small>${escapeHtml(lead.budget || 'ยังไม่ระบุงบ')} · คะแนน ${Number(lead.lead_score || 0)}/100</small></span></td>
        <td><span class="owner-pill ${lead.assigned_to ? '' : 'unassigned'}">${escapeHtml(ownerName(lead.assigned_to))}</span></td>
        <td><span class="followup-time ${followupClass}">${escapeHtml(thaiShortDate(lead.next_follow_up_at))}</span></td>
        <td><span class="status-pill status-${escapeHtml(lead.status)}">${escapeHtml(statusLabels[lead.status] || lead.status)}</span>${lead.priority !== 'normal' ? `<small class="priority priority-${escapeHtml(lead.priority)}">${escapeHtml(priorityLabels[lead.priority] || lead.priority)}</small>` : ''}</td>
        <td><button class="row-action" type="button" data-lead-id="${escapeHtml(lead.id)}">เปิดข้อมูล</button></td>
      </tr>`;
    }).join('');

    const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
    els.pagination.hidden = totalRows <= pageSize;
    els.prevPage.disabled = currentPage === 0;
    els.nextPage.disabled = currentPage >= pageCount - 1;
    els.pageNumber.textContent = `หน้า ${currentPage + 1} / ${pageCount}`;
    const from = totalRows ? currentPage * pageSize + 1 : 0;
    const to = Math.min(totalRows, (currentPage + 1) * pageSize);
    els.pageSummary.textContent = totalRows ? `แสดง ${from.toLocaleString('th-TH')}–${to.toLocaleString('th-TH')}` : 'ไม่มีข้อมูล';
  }

  function renderMetrics() {
    els.metricNew.textContent = Number(metrics.new || 0).toLocaleString('th-TH');
    els.metricActive.textContent = Number(metrics.active || 0).toLocaleString('th-TH');
    els.metricToday.textContent = Number(metrics.due_today || 0).toLocaleString('th-TH');
    els.metricOverdue.textContent = Number(metrics.overdue || 0).toLocaleString('th-TH');
    els.metricUnassigned.textContent = Number(metrics.unassigned || 0).toLocaleString('th-TH');
    els.metricUrgent.textContent = Number(metrics.urgent || 0).toLocaleString('th-TH');
    els.metricSla.textContent = Number(metrics.first_response_overdue || 0).toLocaleString('th-TH');
    els.metricWon.textContent = Number(metrics.won || 0).toLocaleString('th-TH');
    els.lastUpdated.textContent = new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
  }

  function renderPipeline() {
    const pipeline = metrics.pipeline || {};
    const stages = ['new', 'contacted', 'qualified', 'won', 'lost'];
    const max = Math.max(1, ...stages.map(stage => Number(pipeline[stage] || 0)));
    els.pipeline.innerHTML = stages.map(stage => {
      const count = Number(pipeline[stage] || 0);
      return `<button class="pipeline-item" type="button" data-status="${stage}"><header><span>${escapeHtml(statusLabels[stage])}</span><b>${count.toLocaleString('th-TH')}</b></header><div class="pipeline-bar"><i style="width:${Math.max(3, (count / max) * 100)}%"></i></div></button>`;
    }).join('');
  }

  async function loadReferenceData() {
    const [profileResult, optionResult] = await Promise.all([
      client.from('crm_profiles').select('user_id,display_name,email,team').eq('is_active', true).order('display_name'),
      client.rpc('get_crm_filter_options')
    ]);
    if (!profileResult.error) profiles = profileResult.data || [];
    updateOwnerOptions();
    if (!optionResult.error) updateFilterOptions(optionResult.data || {});
  }

  async function loadMetrics() {
    const { data, error } = await client.rpc('get_crm_dashboard_metrics');
    if (error) throw error;
    metrics = data || {};
    renderMetrics();
    renderPipeline();
  }

  async function loadLeads(showNotice = false) {
    if (!client) return;
    setBusy(true);
    let query = client.from('contact_leads').select(leadColumns, { count: 'exact' });
    query = applyLeadFilters(query);
    const orderField = ['today', 'overdue'].includes(activeQueue) ? 'next_follow_up_at' : 'created_at';
    query = query.order(orderField, { ascending: orderField === 'next_follow_up_at', nullsFirst: false }).range(currentPage * pageSize, currentPage * pageSize + pageSize - 1);
    const { data, error, count } = await query;
    setBusy(false);
    if (error) {
      setConnection('', 'โหลดข้อมูลไม่ได้');
      showToast(error.code === '42501' ? 'บัญชีนี้ไม่มีสิทธิ์อ่านข้อมูล CRM' : 'โหลดข้อมูลไม่สำเร็จ', 'error');
      return;
    }
    leads = data || [];
    totalRows = count || 0;
    const maxPage = Math.max(0, Math.ceil(totalRows / pageSize) - 1);
    if (currentPage > maxPage) { currentPage = maxPage; return loadLeads(showNotice); }
    renderRows();
    els.lastUpdated.textContent = new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
    if (showNotice) showToast('อัปเดตข้อมูลล่าสุดแล้ว');
  }

  async function refreshDashboard(showNotice = false) {
    try {
      await Promise.all([loadMetrics(), loadLeads(showNotice)]);
      setConnection('connected', 'เชื่อมต่อข้อมูลสดแล้ว');
    } catch (error) {
      console.error(error);
      setConnection('', 'โหลดข้อมูลไม่ได้');
      showToast('โหลดภาพรวม CRM ไม่สำเร็จ', 'error');
    }
  }

  function setQueue(queue, scroll = false) {
    activeQueue = queue in queueLabels ? queue : 'all';
    currentPage = 0;
    els.statusFilter.value = '';
    if (activeQueue === 'unassigned') els.ownerFilter.value = '';
    els.activeQueueText.textContent = queueLabels[activeQueue];
    $$('[data-queue]').forEach(button => button.classList.toggle('active', button.dataset.queue === activeQueue));
    loadLeads();
    if (scroll) $('#leads').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function loadActivities(leadId) {
    els.activityList.innerHTML = '<p>กำลังโหลด…</p>';
    const { data, error } = await client.from('lead_activities').select('id,actor_id,action,summary,created_at').eq('lead_id', leadId).order('created_at', { ascending: false }).limit(50);
    if (error) { els.activityList.innerHTML = '<p>โหลดประวัติไม่สำเร็จ</p>'; return; }
    const items = data || [];
    els.activityList.innerHTML = items.length ? items.map(item => `<article><i></i><div><b>${escapeHtml(activityLabels[item.action] || item.action)}</b><p>${escapeHtml(item.summary || 'อัปเดตข้อมูลลูกค้า')}</p><small>${escapeHtml(activityActorName(item.actor_id))} · ${escapeHtml(thaiDate(item.created_at))}</small></div></article>`).join('') : '<p>ยังไม่มีประวัติการแก้ไข</p>';
  }

  function toggleLostReason() {
    const isLost = els.detailStatus.value === 'lost';
    els.lostReasonField.hidden = !isLost;
    els.detailLostReason.required = isLost;
  }

  function openLead(id) {
    const lead = leads.find(item => item.id === id);
    if (!lead) return;
    currentLead = lead;
    els.detailId.value = lead.id;
    els.detailName.textContent = lead.name;
    els.detailMeta.textContent = `รับข้อมูล ${thaiDate(lead.created_at)} · ${sourceLabel(lead)}`;
    els.detailPhone.href = `tel:${lead.phone}`;
    els.detailPhoneText.textContent = lead.phone;
    els.detailEmail.hidden = !lead.email;
    els.detailEmail.href = lead.email ? `mailto:${lead.email}` : '#';
    els.detailEmailText.textContent = lead.email || 'ไม่มีอีเมล';
    els.detailService.textContent = lead.service || '—';
    els.detailLocation.textContent = lead.location || '—';
    els.detailBudget.textContent = lead.budget || 'ยังไม่ระบุ';
    els.detailSource.textContent = [sourceLabel(lead), lead.utm_campaign].filter(Boolean).join(' / ');
    els.detailScore.textContent = `${Number(lead.lead_score || 0)}/100${lead.auto_priority_reason ? ` · ${lead.auto_priority_reason}` : ''}`;
    els.detailMessage.textContent = lead.message || 'ลูกค้าไม่ได้ระบุรายละเอียดเพิ่มเติม';
    els.detailStatus.value = lead.status || 'new';
    els.detailPriority.value = lead.priority || 'normal';
    els.detailOwner.value = lead.assigned_to || '';
    els.detailFollowup.value = inputDate(lead.next_follow_up_at);
    els.detailLostReason.value = lead.lost_reason || '';
    els.detailNote.value = lead.internal_note || '';
    els.markContacted.checked = false;
    els.editorStatus.textContent = '';
    els.save.disabled = false;
    toggleLostReason();
    els.dialog.showModal();
    loadActivities(id);
  }

  async function saveLead() {
    if (!client || !currentLead) return;
    const id = els.detailId.value;
    const status = els.detailStatus.value;
    const lostReason = els.detailLostReason.value.trim();
    if (status === 'lost' && !lostReason) {
      els.editorStatus.textContent = 'กรุณาระบุเหตุผลที่ไม่ดำเนินการ';
      els.detailLostReason.focus();
      return;
    }

    els.save.disabled = true;
    els.editorStatus.textContent = 'กำลังบันทึก…';
    const now = new Date().toISOString();
    const patch = {
      status,
      priority: els.detailPriority.value,
      assigned_to: els.detailOwner.value || null,
      internal_note: els.detailNote.value.trim() || null,
      next_follow_up_at: els.detailFollowup.value ? new Date(els.detailFollowup.value).toISOString() : null,
      lost_reason: status === 'lost' ? lostReason : null
    };
    if (els.markContacted.checked) {
      patch.last_contacted_at = now;
      if (!currentLead.first_response_at) patch.first_response_at = now;
      if (status === 'new') patch.status = 'contacted';
    }
    if (['won', 'lost'].includes(patch.status)) patch.closed_at = currentLead.closed_at || now;
    else if (currentLead.closed_at) patch.closed_at = null;

    const { data, error } = await client.from('contact_leads').update(patch).eq('id', id).select(leadColumns).single();
    els.save.disabled = false;
    if (error) {
      console.error(error);
      els.editorStatus.textContent = 'บันทึกไม่สำเร็จ โปรดตรวจสอบข้อมูลและสิทธิ์บัญชี';
      return;
    }
    currentLead = data;
    leads = leads.map(item => item.id === id ? data : item);
    renderRows();
    await Promise.all([loadMetrics(), loadActivities(id)]);
    els.dialog.close();
    showToast('บันทึกข้อมูลลูกค้าแล้ว');
  }

  function csvCell(value) {
    let text = String(value ?? '').replace(/\r?\n/g, ' ').trim();
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  async function exportCsv() {
    els.export.disabled = true;
    els.export.textContent = 'กำลังเตรียมไฟล์…';
    const exported = [];
    const batchSize = 500;
    let offset = 0;
    try {
      while (offset < exportLimit) {
        let query = client.from('contact_leads').select(leadColumns);
        query = applyLeadFilters(query).order('created_at', { ascending: false }).range(offset, offset + batchSize - 1);
        const { data, error } = await query;
        if (error) throw error;
        const batch = data || [];
        exported.push(...batch);
        if (batch.length < batchSize) break;
        offset += batchSize;
      }
      if (!exported.length) { showToast('ไม่มีข้อมูลสำหรับส่งออก'); return; }
      const headers = ['วันที่รับข้อมูล', 'ชื่อลูกค้า', 'โทรศัพท์', 'อีเมล', 'ประเภทงาน', 'พื้นที่', 'งบประมาณ', 'สถานะ', 'ความสำคัญ', 'ผู้รับผิดชอบ', 'ติดตามครั้งถัดไป', 'ติดต่อล่าสุด', 'แหล่งที่มา', 'แคมเปญ', 'บันทึกภายใน'];
      const rows = exported.map(lead => [lead.created_at, lead.name, lead.phone, lead.email, lead.service, lead.location, lead.budget, statusLabels[lead.status], priorityLabels[lead.priority], ownerName(lead.assigned_to), lead.next_follow_up_at, lead.last_contacted_at, sourceLabel(lead), lead.utm_campaign, lead.internal_note].map(csvCell).join(','));
      const blob = new Blob(['\uFEFF' + [headers.map(csvCell).join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NGE-CRM-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(`ส่งออก ${exported.length.toLocaleString('th-TH')} รายการแล้ว`);
      if (exported.length >= exportLimit) showToast(`ส่งออกสูงสุด ${exportLimit.toLocaleString('th-TH')} รายการ กรุณากรองข้อมูลให้แคบลง`);
    } catch (error) {
      console.error(error);
      showToast('ส่งออก CSV ไม่สำเร็จ', 'error');
    } finally {
      els.export.disabled = false;
      els.export.textContent = 'ส่งออก CSV';
    }
  }

  async function copyPhone() {
    if (!currentLead?.phone) return;
    try {
      await navigator.clipboard.writeText(currentLead.phone);
      showToast('คัดลอกเบอร์โทรแล้ว');
    } catch {
      const input = document.createElement('input');
      input.value = currentLead.phone;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
      showToast('คัดลอกเบอร์โทรแล้ว');
    }
  }

  function subscribeRealtime() {
    if (!client || realtimeChannel) return;
    realtimeChannel = client.channel('nge-crm-contact-leads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_leads' }, payload => {
        clearTimeout(reloadTimer);
        reloadTimer = setTimeout(async () => {
          await refreshDashboard();
          if (els.dialog.open && payload.new?.id === currentLead?.id) await loadActivities(currentLead.id);
        }, 350);
        showToast('มีข้อมูลลูกค้าอัปเดตเข้ามา');
      })
      .subscribe(status => {
        if (status === 'SUBSCRIBED') setConnection('connected', 'เชื่อมต่อข้อมูลสดแล้ว');
        else if (['CHANNEL_ERROR', 'TIMED_OUT'].includes(status)) setConnection('', 'Realtime ขัดข้อง กดรีเฟรชได้');
      });
  }

  async function cleanupRealtime() {
    clearTimeout(reloadTimer);
    if (client && realtimeChannel) await client.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }

  async function startDashboard(session) {
    const user = session?.user;
    if (!user || dashboardUserId === user.id) return;
    const role = user.app_metadata?.role || '';
    els.loginView.hidden = true;
    els.setupBanner.hidden = true;
    els.signOut.hidden = false;
    els.accountName.textContent = user.email || 'CRM staff';
    if (!allowedRoles.includes(role)) {
      dashboardUserId = null;
      els.dashboardView.hidden = true;
      els.accessDenied.hidden = false;
      setConnection('', 'บัญชียังไม่มีสิทธิ์ CRM');
      return;
    }
    dashboardUserId = user.id;
    els.accessDenied.hidden = true;
    els.dashboardView.hidden = false;
    setConnection('', 'กำลังโหลดข้อมูล');
    await loadReferenceData();
    await refreshDashboard();
    subscribeRealtime();
  }

  async function signOut() {
    await cleanupRealtime();
    dashboardUserId = null;
    currentLead = null;
    await client.auth.signOut();
  }

  function resetSignedOutView() {
    dashboardUserId = null;
    els.dashboardView.hidden = true;
    els.accessDenied.hidden = true;
    els.loginView.hidden = false;
    els.signOut.hidden = true;
    els.accountName.textContent = 'ยังไม่เข้าสู่ระบบ';
    setConnection('', 'รอเข้าสู่ระบบ');
  }

  els.mobileMenu.addEventListener('click', () => {
    const open = els.sidebar.classList.toggle('open');
    els.mobileMenu.setAttribute('aria-expanded', String(open));
  });
  $$('.crm-nav a').forEach(link => link.addEventListener('click', () => { els.sidebar.classList.remove('open'); els.mobileMenu.setAttribute('aria-expanded', 'false'); }));
  $$('[data-queue]').forEach(button => button.addEventListener('click', () => setQueue(button.dataset.queue, button.closest('.queue-grid') !== null)));
  els.search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => { currentPage = 0; loadLeads(); }, 350); });
  [els.statusFilter, els.ownerFilter, els.serviceFilter, els.sourceFilter].forEach(select => select.addEventListener('change', () => { currentPage = 0; loadLeads(); }));
  els.clearFilters.addEventListener('click', () => { els.search.value = ''; els.statusFilter.value = ''; els.ownerFilter.value = ''; els.serviceFilter.value = ''; els.sourceFilter.value = ''; setQueue('all'); });
  els.refresh.addEventListener('click', () => refreshDashboard(true));
  els.export.addEventListener('click', exportCsv);
  els.prevPage.addEventListener('click', () => { if (currentPage > 0) { currentPage -= 1; loadLeads(); $('#leads').scrollIntoView({ behavior: 'smooth' }); } });
  els.nextPage.addEventListener('click', () => { if ((currentPage + 1) * pageSize < totalRows) { currentPage += 1; loadLeads(); $('#leads').scrollIntoView({ behavior: 'smooth' }); } });
  els.leadRows.addEventListener('click', event => { const button = event.target.closest('[data-lead-id]'); if (button) openLead(button.dataset.leadId); });
  els.pipeline.addEventListener('click', event => {
    const button = event.target.closest('[data-status]');
    if (!button) return;
    activeQueue = 'all';
    currentPage = 0;
    els.statusFilter.value = button.dataset.status;
    els.activeQueueText.textContent = queueLabels.all;
    $$('[data-queue]').forEach(item => item.classList.toggle('active', item.dataset.queue === 'all'));
    loadLeads();
    $('#leads').scrollIntoView({ behavior: 'smooth' });
  });
  els.detailStatus.addEventListener('change', toggleLostReason);
  els.detailPhone.addEventListener('click', () => { els.markContacted.checked = true; });
  els.detailEmail.addEventListener('click', () => { els.markContacted.checked = true; });
  els.copyPhone.addEventListener('click', copyPhone);
  els.save.addEventListener('click', saveLead);

  if (!isConfigured || !window.supabase?.createClient) {
    els.setupBanner.hidden = false;
    els.loginView.hidden = false;
    els.loginStatus.textContent = isConfigured ? 'โหลดระบบเข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่' : 'ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase';
    els.loginForm.querySelectorAll('input,button').forEach(element => { element.disabled = true; });
    setConnection('', 'ยังไม่เชื่อมต่อ Supabase');
    return;
  }

  client = window.supabase.createClient(supabaseUrl, publicKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  client.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') resetSignedOutView();
    else if (session) setTimeout(() => startDashboard(session), 0);
  });
  client.auth.getSession().then(({ data, error }) => {
    if (error) { els.loginView.hidden = false; els.loginStatus.textContent = 'ตรวจสอบสถานะเข้าสู่ระบบไม่สำเร็จ'; return; }
    if (data.session) startDashboard(data.session);
    else resetSignedOutView();
  });
  els.loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    els.loginStatus.textContent = 'กำลังเข้าสู่ระบบ…';
    const submit = els.loginForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    const email = $('#loginEmail').value.trim();
    const password = $('#loginPassword').value;
    const { error } = await client.auth.signInWithPassword({ email, password });
    submit.disabled = false;
    if (!error) {
      els.loginStatus.textContent = '';
      return;
    }
    const message = String(error.message || '').toLowerCase();
    if (message.includes('email not confirmed')) els.loginStatus.textContent = 'อีเมลนี้ยังไม่ได้ยืนยัน กรุณาเปิดอีเมลยืนยันก่อน';
    else if (message.includes('invalid login credentials')) els.loginStatus.textContent = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง (หน้านี้ไม่ใช้ AI Admin Token)';
    else if (message.includes('rate limit')) els.loginStatus.textContent = 'ลองเข้าสู่ระบบหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่';
    else els.loginStatus.textContent = 'เชื่อมต่อระบบเข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่';
  });
  els.signOut.addEventListener('click', signOut);
  els.deniedSignOut.addEventListener('click', signOut);
})();
