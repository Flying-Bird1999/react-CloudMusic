import React, { useState } from 'react'

function Rank(props) {
    const [inputVal, setInputVal] = useState('input')
    return (
        <div>
            <input type="text" value={inputVal} onChange={(e)=> setInputVal(e.target.value)}/>
            <p>{inputVal}</p>
        </div>
    )
}

export default React.memo(Rank)

