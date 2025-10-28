import {privateApi} from "../api.js";


export default function Dashboard() {

    const test = () => {
        privateApi.get('/images/next').then(r => {
            console.log(r)
        }).catch(e => console.log(e))
    }

    return (
        <div className='dashboard-container'>
            <button onClick={test}>TEST</button>
        </div>
    );
}