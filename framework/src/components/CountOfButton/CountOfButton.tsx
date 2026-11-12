export const CountOfButton = () => {
    console.log('render CountOfButton');
    
    let count = 0;
    let countOfButton = () => {
        count++;
    }

	return <button
        type="button"
        className="counter"
        onClick={countOfButton}
    >
        Count is {count}
    </button>
}