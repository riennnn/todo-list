import ReactDOM from 'react-dom'
import React, { useEffect, useState } from 'react'
import { FOCUSABLE_SELECTOR } from '@testing-library/user-event/dist/utils'
// stateを定義する effectをインポートする

// ①入力input⇨todoTitleが更新される（handleAddFormChanges)
// ②作成ボタンをクリックする⇨handleAddTodo関数でtodosが更新される⇨入力箇所は空になる
// ③map関数で新しいtodoが表示される
// ①削除ボタンクリックする⇨handleDeleteTodo指定されたtodoでないtodoリストを選んで新しいtodosが更新される


const App = () => {
  const [todos, setTodos] = useState([]) 
  // state(初期のリスト)を定義する const [現在のstate, stateを更新する関数]  = useState(stateの初期値)
  const [todoTitle, setTodoTitle] = useState('')
  // titleの中身を定義する(作成欄入力箇所) useState('ここに何かを入力すると初期値に入力されている')
  const [todoId, setTodoId] = useState(todos.length + 1)
  // 新しいtodoのidを定義する
  const [isEditable, setIsEditable] = useState(false)
  // 編集画面に切り替えるためのstateの定義する
  const [editId, setEditId] = useState('')
  // 編集したいtodoのid状態を定義する
  const [newTitle, setNewTitle] = useState('')
  // 新しいタイトルのstateを定義して、inputと紐付けする
  const [filter, setFilter] = useState('notStarted')
  const [filteredTodos, setFilteredTodos] = useState([])
  // 絞り込まれたtodoリストのstateを保持する
  const handleAddFormChanges = (e) => {
    setTodoTitle(e.target.value)
  }
  // ①input入力時にstateが更新される
  // inputの入力値にアクセスする際にはイベントオブジェクトeを引数にし、格納したい値にe.target.valueと書く。inputに入力された値をsetTodoTitleに渡す
  const resetFormInput = () => {setTodoTitle('')}
  const handleAddTodo = () => {
    setTodos([...todos, { id: todoId, title: todoTitle, status: 'notStarted' }])
    setTodoId(todoId + 1)
    // ②新しいtodoがTodoリストに追加されるようになる
    //配列todosに新しいidとタイトルを持つ新todoのオブジェクトを追加して、新しいsetTodosを作成 [...既存の配列のステート, { 更新するオブジェクト }]
    // todoIdは既存idに＋１する
    resetFormInput('')
    // 新しいtodoを入力後、リセットされる操作
  }
  const handleDeleteTodo = (targetTodo) => {
    setTodos(todos.filter((todo) => todo !== targetTodo))
  }
  // ③関数に削除対象のtodoが渡り、対象todoをリストから削除する
  // 削除対象のtodoを除いた配列でtodosのstateを更新する
  // filterメソッドは、 配列.filter(条件の判定を返す関数)
  // ここのtodo＊
  // targetTodo（仮引数）、実際はtodoが引数
  // ((todo) => todo !== targetTodo)はfilterの関数(todo)はtodoのみでのOK 複数の引数を取る場合は、例(todo, index, arr)のように()が必要

  const handleOpenEditForm = (todo) => {
    setIsEditable(true)
    setEditId(todo.id)
    // 関数内でidのstateを更新
    setNewTitle(todo.title)
    // 編集対象のtodoタイトルをinputに表示させる
  }
  const handleEditFormChange = (e) => {
    setNewTitle(e.target.value)
  }
  // 編集用のinputの入力値に応じてstateを更新
  const handleCloseEditForm = () => {
    setIsEditable(false)
    setEditId('')
    // 編集後のidのstateを初期化する
  }
  // クリックイベントと同時に画面が切り替わる操作
  const handleEditTodo = () => {
    const newArray = todos.map((todo) => 
    todo.id === editId ? {...todo, title: newTitle} : todo)
    setTodos(newArray)
    // 編集内容をtodoリストの配列に加える
    setNewTitle('')
    setEditId('')
    handleCloseEditForm('')
    // todoリストの更新後にstateを初期化
  }

  const handleStatusChange = (targetTodo, e) => {
    console.log(targetTodo)
    const newArray = todos.map((todo) => todo.id === targetTodo.id ? {...todo, status: e.target.value} : todo)
    setTodos(newArray)
    // todoリストを更新する
  }

  useEffect(() => {
    console.log("123")
    const filteringTodos = () => {
      switch (filter) {
        case 'notStarted':
          setFilteredTodos(todos.filter((todo) => todo.status === 'notStarted'))
          break
        case 'inProgress':
          setFilteredTodos(todos.filter((todo) => todo.status === 'inProgress'))
          break
        case 'done':
          setFilteredTodos(todos.filter((todo) => todo.status === 'done'))
          break
        default:
          // 絞り込み処理を記入
        setFilteredTodos(todos)
        // filteringTodosを呼び出す
      }
    }

    filteringTodos()
  }, [filter, todos])
// todoリストの変更とフィルター操作に連動して、useEffectが実行されるようにする
  return (
    <>
    {isEditable ? (
      // 通常画と編集画面の切り替え
      <div>
        <input 
          type="text"
          label="新しいタイトル"
          value={newTitle}
          // 新しいタイトルのstateを定義してinputと紐付け
          onChange= {handleEditFormChange}
          // 編集用のinputの入力値に応じてstateを更新
          />
        <button onClick={handleEditTodo}>編集を保存</button>
        {/* 編集ボタンを押すと関数が実行される */}
        <button onClick={handleCloseEditForm}>キャンセル</button>
        {/* ボタンに画面を切り替えるためのイベントハンドラ設置 */}
      </div>
      /* 編集フォームの作成 */
        ) : (
      <div>
        <input
          type="text"
          value={todoTitle}
          // ①'todoのstateとinput内の表示を紐付ける
          onChange={handleAddFormChanges}
          // ①input内の入力値が変化するたびにtodoのstateを変更する処理
          // <input onChange={実行したい処理}/>
        />
        <button onClick={handleAddTodo}>作成</button>
        {/* ②作成ボタンを押すとhandleAddTodo関数が実行される onClick={実行したい処理}*/}
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        {/* // フィルターの値を保持する */}
          <option value="all">すべて</option>
          <option value={"notStarted"}>未着手</option>
          <option value={"inProgress"}>作業中</option>
          <option value={"done"}>完了</option>
        </select>
        {/* フィルターを設置し、stateと紐付ける */}
      </div>
        )}
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <select value={todo.status} onChange={(e) => handleStatusChange(todo, e)}>
              {/* セレクトボックス操作時に関数が実行される */}
              <option value ="notStarted">未着手</option>
              <option value ="inProgress">作業中</option>
              <option value ="done">完了</option>
            </select>
            {/* セレクトボックスの追加 */}
            <button onClick={()=> handleOpenEditForm(todo)}>編集</button>
            {/* 画面を切り替えるためのイベントハンドラ設置 */}
            {/* クリックイベントで実行される関数に編集対象のtodoを渡す */}
            <button onClick={() => handleDeleteTodo(todo)}>削除</button>
            {/* ③削除ボタンを設置する todoを引数とすることでhandleDeletetodo内の削除対象を指定する 引数を渡すにはonClick{() =>関数名(引数)} */}
            {/* todo.map((todo)=>(<li></li>)) の((todo)=>(<li></li>))はmapの関数 */}
          </li>
        ))}
      </ul>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
