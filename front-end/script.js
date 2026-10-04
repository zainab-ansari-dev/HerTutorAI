const landingView = document.getElementById('landing-view');
const chatView = document.getElementById('chat-view');
const chatInput = document.getElementById('chat-input');
const scrollContainer = document.getElementById('main-scroll-container');
const userMessageText = document.getElementById('chat-user-message-text');
const userBubbleAttachments = document.getElementById('user-bubble-attachments');
const userTimeStamp = document.getElementById('user-time-stamp');
const fileInput = document.getElementById('file-input');
const attachmentPreviewContainer = document.getElementById('attachment-preview-container');
const inputContainer = document.getElementById('chat-input-container');

const aiIntro = document.getElementById('ai-dynamic-intro');
const ytThumbnail = document.getElementById('yt-thumbnail-img');
const ytHighlightBadge = document.getElementById('yt-highlight-badge');
const ytChannelTag = document.getElementById('yt-channel-tag');
const ytViewsTag = document.getElementById('yt-views-tag');
const ytVideoTitle = document.getElementById('yt-video-title');
const ytReviewNote = document.getElementById('yt-review-note');
const ytExternalBtn = document.getElementById('yt-external-btn');

const ytThumbnailLink = document.getElementById('yt-thumbnail-link');
const ytResourceBtn = document.getElementById('yt-resource-btn');

let currentTopic = "";
let attachedFiles = [];

function triggerFileUpload(type) {
    if (type === 'image') {
    fileInput.accept = 'image/*';
    } else if (type === 'document') {
    fileInput.accept = '.pdf,.doc,.docx,.txt';
    } else {
    fileInput.accept = 'image/*,.pdf,.doc,.docx,.txt';
    }
    fileInput.click();
}

function handleFileInput(e) {
    if (e.target.files && e.target.files.length > 0) {
        processFiles(Array.from(e.target.files));
    }
    e.target.value = ''; 
}

function processFiles(files) {
    files.forEach(file => {
        const reader = new FileReader();
        const isImage = file.type.startsWith('image/');

        reader.onload = (event) => {
          attachedFiles.push({
            name: file.name,
            size: formatBytes(file.size),
            isImage: isImage,
            dataUrl: event.target.result
          });
          renderAttachmentPreviews();
    };

    if (isImage) {
        reader.readAsDataURL(file);
    } else {
        reader.readAsDataURL(file);
    }
    });
}

function toggleHistorySidebar() {
      const historyModal = document.getElementById('history-sidebar-modal');
      if (!historyModal) return;

      if (historyModal.classList.contains('hidden')) {
        renderSearchHistory();
        historyModal.classList.remove('hidden');
      } else {
        historyModal.classList.add('hidden');
      }
}

function saveSearchToHistory(query, videoTitle) {
      if (!query || query.trim() === '') return;

      let history = JSON.parse(localStorage.getItem('study_search_history')) || [];

      history = history.filter(item => item.query.toLowerCase() !== query.toLowerCase());

      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      history.unshift({
        query: query.trim(),
        matchedTitle: videoTitle || 'No match found',
        time: timeString
      });

      history = history.slice(0, 15);

      localStorage.setItem('study_search_history', JSON.stringify(history));
      renderSearchHistory();
    }

function reSearch(pastQuery) {

    if (!pastQuery) return;
    
    chatInput.value = pastQuery;
    attachedFiles = [];
    renderAttachmentPreviews();

    const historyModal = document.getElementById('history-sidebar-modal');
    if (historyModal && !historyModal.classList.contains('hidden')) {
        historyModal.classList.add('hidden');
    }

    handleChatSubmit();

      chatInput.value = pastQuery;
      toggleHistorySidebar();
}

function clearSearchHistory() {
      localStorage.removeItem('study_search_history');
      renderSearchHistory();
}


function renderSearchHistory() {
  const historyContainer = document.getElementById('search-history-container');
  if (!historyContainer) return;

  const history = JSON.parse(localStorage.getItem('study_search_history')) || [];

  if (history.length === 0) {
    historyContainer.innerHTML = `
      <div class="p-6 text-center text-zinc-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs">No recent search history found.</p>
      </div>`;
    return;
  }

  historyContainer.innerHTML = history.map((item) => `
    <div onclick="reSearch('${escapeHtml(item.query)}')" 
         class="flex items-center justify-between p-3 rounded-xl bg-[#222228]/50 hover:bg-[#222228] border border-[#2b2b31] cursor-pointer transition group">
      <div class="flex flex-col overflow-hidden">
        <span class="text-xs font-medium text-zinc-200 group-hover:text-indigo-400 truncate">🔍 ${escapeHtml(item.query)}</span>
        <span class="text-[11px] text-zinc-400 truncate mt-0.5">Matched: ${escapeHtml(item.matchedTitle)}</span>
      </div>
      <span class="text-[10px] text-zinc-500 font-mono ml-3 shrink-0">${item.time}</span>
    </div>
  `).join('');
}

function removeAttachment(index) {
    attachedFiles.splice(index, 1);
    renderAttachmentPreviews();
}

function renderAttachmentPreviews() {
    if (attachedFiles.length === 0) {
    attachmentPreviewContainer.classList.add('hidden');
    attachmentPreviewContainer.innerHTML = '';
    return;
    }

attachmentPreviewContainer.classList.remove('hidden');
attachmentPreviewContainer.innerHTML = attachedFiles.map((file, idx) => {
    if (file.isImage) {
        return `
        <div class="flex items-center gap-2 bg-[#202028] border border-[#2b2b31] rounded-lg p-1.5 pr-2.5 text-xs text-zinc-300">
            <img src="${file.dataUrl}" alt="${escapeHtml(file.name)}" class="w-7 h-7 object-cover rounded border border-white/10" />
            <span class="max-w-[120px] truncate text-[11px] font-medium text-white">${escapeHtml(file.name)}</span>
            <button type="button" onclick="removeAttachment(${idx})" class="text-zinc-500 hover:text-red-400 ml-1 font-bold text-xs cursor-pointer">✕</button>
        </div>
          `;
    } else {
        return `
        <div class="flex items-center gap-2 bg-[#202028] border border-[#2b2b31] rounded-lg px-2.5 py-1.5 text-xs text-zinc-300">
            <span class="text-base select-none">📄</span>
            <div class="flex flex-col">
            <span class="max-w-[130px] truncate text-[11px] font-medium text-white">${escapeHtml(file.name)}</span>
            <span class="text-[9px] text-zinc-500">${file.size}</span>
            </div>
            <button type="button" onclick="removeAttachment(${idx})" class="text-zinc-500 hover:text-red-400 ml-1.5 font-bold text-xs cursor-pointer">✕</button>
        </div>
         `;
    }
    }).join('');
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      inputContainer.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        inputContainer.classList.add('ring-2', 'ring-indigo-500', 'border-indigo-500');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      inputContainer.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        inputContainer.classList.remove('ring-2', 'ring-indigo-500', 'border-indigo-500');
      }, false);
    });

    inputContainer.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        processFiles(Array.from(dt.files));
      }
});

function resetChat() {
    chatInput.value = '';
    attachedFiles = [];
    renderAttachmentPreviews();
      
    chatView.classList.add('hidden');
    landingView.classList.remove('hidden');
      
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    chatInput.focus();
}

function handleChatSubmit(e) {
    if (e) e.preventDefault();
      
    const query = chatInput.value.trim();
    const filesToSubmit = [...attachedFiles];

    if (!query && filesToSubmit.length === 0) return;

    chatInput.value = '';

    executeSubmission(
        query || (filesToSubmit[0].isImage ? 'Analyzed uploaded diagram' : 'Analyzed uploaded document'),
        filesToSubmit
      );
}

async function executeSubmission(query, files) {
    const now = new Date();
    userTimeStamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let imageDataBase64 = null;
    if (files && files.length > 0) {
    const imageFile = files.find(f => f.isImage);
    if (imageFile) {
        imageDataBase64 = imageFile.dataUrl;
    }
}

    userMessageText.textContent = query;

    if (files && files.length > 0) {
        userBubbleAttachments.classList.remove('hidden');
        userBubbleAttachments.innerHTML = files.map(file => {
          if (file.isImage) {
            return `
              <div class="relative rounded-lg overflow-hidden border border-white/20 shadow-md">
                <img src="${file.dataUrl}" alt="${escapeHtml(file.name)}" class="max-h-36 max-w-xs object-cover" />
                <span class="absolute bottom-1 right-1 bg-black/70 text-[9px] px-1.5 py-0.5 rounded text-white font-mono">${escapeHtml(file.name)}</span>
              </div>
            `;
          } else {
            return `
              <div class="inline-flex items-center gap-1.5 bg-black/30 border border-white/15 px-2.5 py-1 rounded-md text-xs text-white shadow-sm">
                <span>📄</span>
                <span class="font-medium">${escapeHtml(file.name)}</span>
                <span class="text-[10px] text-indigo-200">(${file.size})</span>
              </div>
            `;
          }
        }).join('');
      } else {
        userBubbleAttachments.classList.add('hidden');
        userBubbleAttachments.innerHTML = '';
    }

    attachedFiles = [];
    renderAttachmentPreviews();

    landingView.classList.add('hidden');
    chatView.classList.remove('hidden');
    scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });

    aiIntro.innerHTML = imageDataBase64
    ? `<span class="text-zinc-400 font-mono flex items-center gap-2"><span class="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span> LLaVA is analyzing your image diagram...</span>`
    : `<span class="text-zinc-400 font-mono flex items-center gap-2"><span class="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></span> Llama is reading your watch history...</span>`;
      
    const ytCardContainer = ytThumbnail ? (ytThumbnail.closest('.border') || ytThumbnail.parentElement) : null;
    if (ytCardContainer) ytCardContainer.classList.add('hidden');

    try {
    const response = await fetch('http://127.0.0.1:8000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: query,
            image_data: imageDataBase64
          })
    });

    const data = await response.json();

    if (data.status === "success") {

          if (typeof marked !== 'undefined') {
    aiIntro.innerHTML = marked.parse(data.message);
} else {
    aiIntro.textContent = data.message;
}

          if (data.video) {
            ytThumbnail.src = data.video.thumb;
            ytVideoTitle.textContent = data.video.title;
            ytReviewNote.textContent = data.video.my_note;
            ytExternalBtn.href = data.video.url;
            ytThumbnailLink.href = data.video.url;
            ytResourceBtn.href = data.video.resource_url || data.video.url;

            if (ytHighlightBadge) ytHighlightBadge.textContent = data.video.timestamp || 'Full Lecture';
            if (ytChannelTag) ytChannelTag.textContent = 'Peer Curated Video';
            if (ytViewsTag) ytViewsTag.textContent = 'Highly Recommended';

            if (ytCardContainer) ytCardContainer.classList.remove('hidden');
        }

        const videoTitle = data.video ? data.video.title : 'No video match';
            
        const historyQuery = query || (files && files.some(f => f.isImage) ? 'Analyzed uploaded diagram' : 'Analyzed uploaded document');
            
        saveSearchToHistory(historyQuery, videoTitle);
    } else {
        aiIntro.innerHTML = `<span class="text-red-400 font-mono">⚠️ Backend Processing Failure: ${escapeHtml(data.message)}</span>`;
    }
    } catch (err) {
        aiIntro.innerHTML = `<span class="text-red-400 font-mono">⚠️ Could not reach python backend. Ensure your FastAPI app is running on port 8000!</span>`;
    }

    setTimeout(() => {
        scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      }, 50);
    }

    function escapeHtml(text) {
      if (!text) return '';
      return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatSubmit(e);
      }
    });
