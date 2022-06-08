import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { state, dispatch } = useContext(UserContext)

    useEffect(() => {
        console.count()
        fetch('/allposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setData(result.posts)
                setIsLoading(false)
            })
    }, [])
    if(isLoading) return <div>Loading...</div>

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else return item
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else return item
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }
    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    }
                    else return item
                })
                setData(newData)
            })
            .catch(err => console.log(err))

    }
    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }
    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map((item) => {

                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch(err => console.log(err))
    }
    return (
        <div className="home">
            {
                data ? data.map(item => {
                    return (
                        <div className="card home-card" key={item?._id}>
                            
                            <h5 className="userName" >
                            <img className="prof-pic-icon" src={item?.postedBy?.profilepic} alt=""/>
                                <Link to={item?.postedBy?._id !== state?._id ? "/profile/" + item.postedBy?._id : "/profile"}>
                                    {item.postedBy?.name}</Link>
                                {item.postedBy?._id === state?._id &&
                                    <i className="material-icons" style={{ float: "right" }}
                                        onClick={() => deletePost(item._id)}
                                    >delete</i>}
                            </h5>
                            <div className="card-image">
                                <img src={item?.photo} key={item?._id} alt={item?.title} />
                                <div className="card-content">
                                    {/* <i className="material-icons">favorite_border</i> */}
                                    {item?.likes?.includes(state._id)
                                        ?
                                        <i className="material-icons like-unlike"
                                            onClick={() => { unlikePost(item._id) }}
                                        >favorite</i>
                                        :
                                        <i className="material-icons like-unlike" 
                                            onClick={() => { likePost(item._id) }}
                                        >favorite_border</i>
                                    }


                                    <h6>{item.likes.length} likes</h6>
                                    {/* <h6>{item.title}</h6> */}
                                    <p>{item.body}</p>
                                    {
                                        item.comments?.map(record => {
                                            return (
                                                <h6 key={record?._id ?? 1}>
                                                    <span style={{ fontWeight: "500" }}>
                                                        {record?.postedBy?.name ?? 'unknown'}
                                                    </span>
                                                    {' '}{record?.text}
                                                    {record?.postedBy._id === state._id &&
                                                        <i className="material-icons" style={{ float: "right" }}
                                                            onClick={() => deleteComment(item._id, record?._id)}
                                                        >delete</i>}
                                                </h6>

                                            )
                                        })
                                    }
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        makeComment(e.target[0].value, item._id)
                                        
                                    }}>
                                        <input type="text" placeholder="add a comment" />
                                    </form>
                                </div>
                            </div>
                        </div>

                    )
                })
                    : <div />
            }
        </div>

    )

}
export default Home;