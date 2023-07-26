import { useEffect, useState } from "react";
import Arrow from "./png/arrow.png"
import Search from "./png/search.png"
import Trash from "./png/trash.png"
import Edit from "./png/edit.png"


const element = 10

function App() {

  const [datas, setDatas] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [alldata, setAllData] = useState([]);
  const [saveData, setSaveData] = useState([]);
  const [allpage, setAllpage] = useState([1,2,3,4,5,6,7,8,9,10]);
  const [addpage,setAddpage] = useState(false);
  const [nextId, setNextId] = useState(1);
  const [addData,setAddData] = useState({
    name: "",
    date: "",
    namber: ""
  })
  const [color, setColor] = useState([0,0,0]);

  useEffect(() => {
        let jsonData = saveData;
        let startElement = page * element
        let finishElement = (page*element + 10)
        if(sort === "name"){
          jsonData = jsonData.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (sort === "date") {
          jsonData = jsonData.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
          });
        }
        if(sort === "namber"){
          jsonData = jsonData.sort((a, b) => a.namber - b.namber);
        }
        if (search !== ""){
          let filteredData = jsonData.filter(item => {
            return Object.entries(item).some(([key, value]) => {
              if (key === 'userId') return false;
              return String(value).toLowerCase().includes(search.toLowerCase());
            });
          });
          setAllData(filteredData)
          filteredData = filteredData.slice(startElement, finishElement)
          setDatas(filteredData)
        }else{
          setAllData(jsonData)
          jsonData = jsonData.slice(startElement, finishElement)
          setDatas(jsonData)
        } 
  }, [page,search,sort,saveData]);

  useEffect(() => {
    let x = []
      for(let i = 1; i <= Math.ceil(alldata.length/10); i++){
        x.push(i)
      }
      setAllpage(x)
  }, [datas, alldata, sort]);

  const addNewElement = () => {
    if(addData.name !== "" && addData.date !== "" && addData.namber !== "" && !isNaN(addData.namber)){
      const copiedData = { ...addData };
      const updatedObject = { id: nextId, name: copiedData.name, date: copiedData.date, namber: copiedData.namber};
      setSaveData([...saveData, updatedObject]);
      setAddpage(!addpage);
      setAddData({
        name: "",
        date: "",
        namber: ""
      });
      setNextId(nextId + 1)
    }else {
      if(addData.name === ""){
          setColor([1,0,0])
      }
      if(addData.date === ""){
        setColor([0,1,0])
      }
      if(addData.namber === "" || isNaN(addData.namber)){
        setColor([0,0,1])
      }
      setTimeout(()=>{setColor([0,0,0])}, 1000)
    }
  };
 
  const deleteItem = (id) => {
    const index = saveData.findIndex((item) => item.id === id);
    const updatedDatas = [...saveData];
    updatedDatas.splice(index, 1);
    setSaveData(updatedDatas);
  };

  const changeItem = (id) => {
    const copiedData = saveData.find((obj) => obj.id === id);
    const updatedObject = { name: copiedData.name, date: copiedData.date, namber: copiedData.namber};
    setAddData(updatedObject)
    deleteItem(id)
    setAddpage(!addpage)
  };

  return (
    <div className="App">
      <header>
        <input className="search" type="text" placeholder="поиск" value={search} onChange={(e)=>{
          setSearch(e.target.value)
          setPage(0)
        }}/>
        <img src={Search} alt="search" />
        <h3 className="add" onClick={()=> setAddpage(!addpage)}>Добавить</h3>
      </header>
      <div className={ addpage === true ? "active_add" : "not_active_add"}>
        <div className="active_add_div">
            <input
              className={color[0] === 0? "active_add_name": "active_add_false"}
              value={addData.name}
              placeholder="name"
              onChange={(e) => setAddData({ ...addData, name: e.target.value })}
            />
            <input
              className={color[1] === 0? "active_add_date": "active_add_false"}
              placeholder="date"
              value={addData.date}
              type="date"
              onChange={(e) => setAddData({ ...addData, date: e.target.value })}
            />
            <input
              className={color[2] === 0? "active_add_namber": "active_add_false"}
              placeholder="namber"
              value={addData.namber}
              onChange={(e) => setAddData({ ...addData, namber: e.target.value })}
            />
            <button onClick={() => {addNewElement();}}>add</button>
        </div>
      </div>
      <div className="tables">
        <div className="tables_top">
          <div className="tables_top_div" onClick={()=>setSort("name")}><button >имя</button> <img src={Arrow} alt="arrow" /></div>
          <div className="tables_top_div" onClick={()=>setSort("date")}><button >дата</button> <img src={Arrow} alt="arrow" /></div>
          <div className="tables_top_div" onClick={()=>setSort("namber")}><button >номер</button> <img src={Arrow} alt="arrow" /></div>
        </div>
        <div className="tables_main">
          {datas.map(item => (
            <div className="table_main_element">
              <div className="table_main_element_name">{item.name}</div>
              <div className="table_main_element_date">{item.date}</div>
              <div className="table_main_element_namber">{item.namber}</div>
              <div className="table_main_element_redact">
                <img onClick={()=>changeItem(item.id)} src={Edit} alt="edit"/>
                <img onClick={()=>deleteItem(item.id)} src={Trash} alt="trash"/>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer>
        <button className="page_button" onClick={()=>{
            if (page > 0) {
            setPage(page - 1)
            }
          }}> Назад </button>
          <div className="page">
            {allpage.map(item => (
              <p className={(page+1) === item ? "activ" : "simple"}>{item}</p>
            ))}
          </div>
        <button className="page_button" onClick={()=>{
            if (page < (alldata.length/10 -1)) {
              setPage(page + 1)
            }
          }}> Далее </button>
      </footer>
    </div>
  );
}

export default App;

