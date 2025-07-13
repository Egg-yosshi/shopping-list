// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('add-form');
    const itemNameInput = document.getElementById('item-name');
    const itemQuantityInput = document.getElementById('item-quantity');
    const shoppingList = document.getElementById('shopping-list');

    // --- データ保存・読み込み機能 ---
    // ページ読み込み時にLocal Storageからデータを読み込む
    loadList();

    // フォームが送信されたときの処理
    addForm.addEventListener('submit', (e) => {
        e.preventDefault(); // フォームのデフォルトの送信をキャンセル
        
        const name = itemNameInput.value.trim();
        const quantity = itemQuantityInput.value;

        if (name === '') {
            alert('品名を入力してください。');
            return;
        }

        addItem(name, quantity);
        
        // 入力欄をリセット
        itemNameInput.value = '';
        itemQuantityInput.value = '1';
        itemNameInput.focus();

        // データを保存
        saveList();
    });

    // アイテムを追加する関数
    function addItem(name, quantity, isChecked = false) {
        const li = document.createElement('li');
        if (isChecked) {
            li.classList.add('checked');
        }

        li.innerHTML = `
            <div class="item-info">
                <span class="item-text">${name}</span>
                <span class="item-quantity-badge">${quantity}</span>
            </div>
            <button class="delete-btn">×</button>
        `;

        shoppingList.appendChild(li);

        // チェック（取り消し線）機能
        const itemInfo = li.querySelector('.item-info');
        itemInfo.addEventListener('click', () => {
            li.classList.toggle('checked');
            saveList(); // 状態が変わったので保存
        });

        // 削除ボタンの機能
        const deleteBtn = li.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
            saveList(); // 削除したので保存
        });
    }

    // 現在のリストをLocal Storageに保存する関数
    function saveList() {
        const items = [];
        shoppingList.querySelectorAll('li').forEach(li => {
            const name = li.querySelector('.item-text').textContent;
            const quantity = li.querySelector('.item-quantity-badge').textContent;
            const isChecked = li.classList.contains('checked');
            items.push({ name, quantity, isChecked });
        });
        // 配列をJSON文字列に変換して保存
        localStorage.setItem('shoppingList', JSON.stringify(items));
    }

    // Local Storageからリストを読み込んで表示する関数
    function loadList() {
        // JSON文字列を配列に変換して取得（データがなければ空の配列）
        const items = JSON.parse(localStorage.getItem('shoppingList')) || [];
        items.forEach(item => {
            addItem(item.name, item.quantity, item.isChecked);
        });
    }
});