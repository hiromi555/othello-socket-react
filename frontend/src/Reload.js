export const Reload =()=> {
  return (
    <div className="button-wrap">
      <button className="button" onClick={()=> window.location.reload()}>リロード</button>
    </div>
  )
}
