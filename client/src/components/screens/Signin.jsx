import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'
import { isEmail } from "validator";


const Signin = () => {
    const {state, dispatch} = useContext(UserContext)
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const history = useHistory();
    const PostData = () => {
        if (!isEmail(email)) {
            return M.toast({ html: "Invalid Email", classes: "#ff5252 red accent-2" })
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#ff5252 red accent-2" })
                }
                else {
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    M.toast({ html: "Signed in!", classes: "#43a047 green darken-1" })
                    history.push('/')
                }
                console.log('user >>>> ' + data)
            }).catch(err=>{
                console.log(err)
            })
    }
    return (
        <div className="mycard" >
            <div className="card auth-card input-field">

                <h2>Instasham</h2>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>PostData()}
                >
                    Signin
                </button>
                <h5>
                    <Link to="/signup" style={{fontFamily:"sans-serif" }}> Need an account?</Link>
                </h5>
            </div>
        </div>
    )

}
export default Signin;