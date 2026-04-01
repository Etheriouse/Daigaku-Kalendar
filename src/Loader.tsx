/* eslint-disable @typescript-eslint/no-explicit-any */
import './loader.css'

function Loader() {

    return (
    <div className="loading" style={style.loading}>
        <div className="loader" style={style.loader}></div>
    </div>
    );

}

const style: any = {
    loader: {
        width: '50px',
        height: '50px',
        border: '5px solid #2a2a2a',
        borderTop: '5px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },

    loading: {
        marginTop: '40%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }
}


export default Loader