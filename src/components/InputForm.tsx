/**
 *  The general FORM for filling an object with arbitrary number of props
 *  params: data object, its setter function, data handler function (for saving into DB), css class name, error message
 * 
 *      3, 10 NOV 2023
 */

export default function InputForm({ data, setData, dataHandler, title, buttonCaption, clazz, error }:
                { data: object, setData: React.Dispatch<React.SetStateAction<object>>,
                    dataHandler: () => Promise<void> | void, title: string, buttonCaption: string, clazz: string, error: string })
    {


    const inputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const newData = {...data, [key]: e.target.value};   // change the value belonging to the given key
        setData(newData);
    }
    
    const canSave = Object.entries(data).filter(([, value]: [string, string]) => value === "").length === 0;   // there can not be any void prop

    // -- the key part:  what should happen when Save?...
    const saveNewData = () => {
        console.log(data);
        dataHandler();
    }


    return (
        <section className={clazz}>

            <h2>{title}</h2>

            {Object.entries(data).map((entry, index) => 
                <article key={index}>
                    <label htmlFor={entry[0]} > {entry[0][0].toUpperCase() + entry[0].slice(1)} </label>
                    <input type="text" id={entry[0]} name={entry[0]} value={entry[1]} onChange={(e) => inputChange(e, entry[0])} />
                </article>
            )}
            <button type="button" disabled={!canSave} onClick={saveNewData} >{buttonCaption}</button>

            {error !== "" && <h3>{error}</h3>}

        </section>
    )

}