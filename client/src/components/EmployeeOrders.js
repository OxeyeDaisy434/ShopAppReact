import React, {useContext, useState, useEffect, useRef} from 'react'
import { DataContext } from '../App'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
export default function EmployeeOrders() {
    const {userData} = useContext(DataContext)
    const navigation = useNavigate()

    useEffect(() => {
        if (!userData.isEmployee || userData === {}) {
            navigation("/")
        }
    }, [userData, navigation])
    
    
    const [selectRequest, SetSelectRequest] = useState(true);
    const [orderList, SetOrdersList] = useState({})

    useEffect(() => {
    
      SetOrdersList({});
      SetSelectRequest(true);
      const source = Axios.CancelToken.source();
    
      Axios
        .post("http://localhost:3001/api/employeeOrders", {employeeID: userData.ID},{
            cancelToken: source.token,
        })
        .then((response) => {
            SetOrdersList(response.data);
        })
        .catch((err) => {
            SetSelectRequest(false);
            if (Axios.isCancel(err)) {
                console.log("Request canceled", err.message);
            } else {
                console.log(err);
            }
        });
  
  
  
      return () => {
        source.cancel();
      };
    }, [userData.ID]);

    const updateStatus = (status, callback) =>{

        Axios
        .post("http://localhost:3001/api/status", {status: status})
        .then((response) => {
          callback(response.data)
        })
        .catch((err) => console.log(err));
      }

    const selectRef = useRef(null);
    const HandleSubmit = (event) =>{
        event.preventDefault()
        const selectValue = selectRef.current.value;
        updateStatus(selectValue, result =>{
            console.log(result)
        })

    }

    return (
        (!selectRequest ?
            (
            <div>
                <h1 className='error'>Wystąpił błąd podczas ładowania danych</h1>
            </div>
            )
            :
            (   (Object.keys(orderList).length <= 0 ?
                (
                    <div>
                        <h1 className='error'>Brak zamówień</h1>
                    </div>
                )
                :
                (
                    <div className='page-order'>
                <h3 className="header-order">Twoje zamówienia</h3>
                {Object.keys(orderList).map(key =>{
                  return (
                  
                    <div key={key} className="whole-order">
                        <div>
                            <p className="order-p">ID zamówienia: {orderList[key].ID_zamowienie}</p>
                            <p className="order-p">Data zamówienia: {(orderList[key].Data).substr(0, 10)}</p>
                            <p className="order-p">Status zamówienia: {(orderList[key].Status)}</p>
                        </div>

                        <div>
                            <p className="order-p">Województwo: {orderList[key].Wojewodztwo}</p>
                            <p className="order-p">Miasto: {orderList[key].Data.Miasto}</p>
                            <p className="order-p">Kod pocztowy: {(orderList[key].Kod_pocztowy)}</p>
                            <p className="order-p">Ulica: {orderList[key].Ulica}</p>
                            <p className="order-p">Numer_budynku: {orderList[key].Numer_budynku}</p>
                            {orderList[key].Numer_mieszkania !== null ? <p className="order-p">Status zamówienia: {(orderList[key].Numer_mieszkania)}</p> : {}}
                        </div>
                        <div className='all-products'>
                          {
                            Object.keys(orderList[key].Produkty).map(key_ =>{
                              return (
                                <div key={key_} className="products-order">
                                    <p className="product-p-order">ID produktu: {orderList[key].Produkty[key_].ID_produkt}</p>
                                    <p className="product-p-order">Nazwa produktu: {orderList[key].Produkty[key_].Nazwa_gry}</p>
                                    <p className="product-p-order">System: {orderList[key].Produkty[key_].System}</p>
                                    <p className="product-p-order">Ilość sztuk: {orderList[key].Produkty[key_].Ilosc}</p>
                                </div>
                              )
                            })
                          }
                          </div>
                    <form key={key} onSubmit={(event) => HandleSubmit(event)}>
                        <select className="select-status" id="status_"  ref={selectRef}>
                            <option value={1}>Wysłane</option>
                            <option value={2}>W trakcie realizacji</option>
                            <option value={3}>Przyjęte do realizacji</option>
                        </select>
                        <button type="submit">Zmień status</button>
                    </form>
                    <br/>
                    <br/>
                    </div>
                  )
                  }) 
                }
              </div>
                ))
            )
        )
    )
}
