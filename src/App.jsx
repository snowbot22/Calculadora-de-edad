import { useState } from 'react'
import './assets/scss/app.scss'
import arrow from './assets/images/icon-arrow.svg';
import { intervalToDuration,isAfter,isValid, isExists, parse, set } from 'date-fns'
import { useForm } from 'react-hook-form';

function App() {

  const {register, handleSubmit, getValues, watch, formState:{errors}}= useForm();
  
  const [totalDays, setTotalDays] = useState("--");
  const [totalMonths, setTotalMonths] = useState("--");
  const [totalYears, setTotalYears] = useState("--");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  function calculateAge( year, month, day ){
    let date= new Date(year, month-1, day);
    let pastYear = new Date().getFullYear() - 1;
    let pastBirthDate = new Date(pastYear, month -1, day);
    let currentDate = new Date();
    let currentBirthDate = new Date(currentDate.getFullYear(), date.getMonth(), day);
    if(isAfter(currentBirthDate, currentDate)){
      const futureDates= intervalToDuration ( {start: pastBirthDate, end: currentDate});
      const futureYears = intervalToDuration( {start: date, end: currentDate})
      setTotalDays(futureDates.days);
      setTotalMonths(futureDates.months);
      setTotalYears(futureYears.years);
      console.log(futureDates);
    }
    else{
        const months= intervalToDuration ( {start: currentDate, end: currentBirthDate});
        const futureYears = intervalToDuration( {start:currentBirthDate, end:date})
        setTotalDays(months.days);
        setTotalMonths(months.months);
        setTotalYears(futureYears.years);
    }

  }

  function validation( year, month, day ){
    if(day === "" || month === "" || year === ""  ){
      setError(true); 
      setMessage(false);
    }
    else if(!isExists(year, month-1, day)){
      setError(true);
      setMessage(true);
    }
    else{
      setError(false);
      setMessage(false);
      console.log("es valido");
    }
  }

  const setSubmit = handleSubmit((data)=>{
    const {day, month, year} = data;
    if(!error){
      calculateAge(year, month, day);
    }
  })

  const handleClick= () => { 
    let day = parseInt(getValues("day"));
    let month = parseInt(getValues("month"));
    let year = parseInt(getValues("year"));

    validation(year, month, day);
  }


  return (
    <>
      <main>
        <article className='container'>
          <section className= {error ? "section--inputs flex--column--nowrap" :"section--inputs flex--column--nowrap"}>
            <form className='section__form' onSubmit={setSubmit}>
              <div className='section__text flex--column--nowrap'>
                <label className={error ? "section__title color--red" :'section__title color--grey'} htmlFor="day">DAY</label>
                <input className={error ? "section__input border--red" :'section__input border--grey'} type="number" name="day" id="day" placeholder='DD' 
                {...register("day",{
                  validate: (value) =>{
                    if (value > 31 || value < 1) {
                      setError(true);
                      return "Must be a valid day";
                    }
                    else if( value === ""){
                      setError(true);
                      setMessage(false);
                      return "This field is required";
                    }
                  }
                })}/>
                {errors.day && <p className='section--submessage'> {errors.day.message} </p>}
              </div>
              <div className='section__text flex--column--nowrap'>
                <label className={error ? "section__title color--red" :'section__title color--grey'} htmlFor="month">MONTH</label>
                <input className={error ? "section__input border--red" :'section__input border--grey'} type="number" name="month" id="month" placeholder='MM'
                {...register("month",{
                  validate: (value) => {
                    if (value > 12 || value < 1 ) {
                      setError(true);
                      return "Must be a valid month";
                    }
                    else if( value === ""){
                      setError(true);
                      setMessage(false);
                      return "This field is required";
                    }
                  }
                })} />
                {errors.month && <p className='section--submessage'> {errors.month.message} </p>}
              </div>
              <div className='section__text flex--column--nowrap'>
                <label className={error ? "section__title color--red" :'section__title color--grey'} htmlFor="year">YEAR</label>
                <input className={error ? "section__input border--red" :'section__input border--grey'} type="number" name="year" id="year" placeholder='YYYY'
                {...register("year", {
                  validate: (value) => {
                    if (value > new Date().getFullYear()) {
                      setError(true);
                      return "Must be in the past";
                    }else if( value === ""){
                      setError(true);
                      setMessage(false);
                      return "This field is required";
                    }
                  }
                })} />
                {errors.year && <p className='section--submessage'> {errors.year.message} </p>}
              </div>
              <div className='container--button'>
                <button className='button--purple' type='text' onClick={handleClick}>
                  <figure>
                    <img src={arrow} alt="arrow-icon" />
                  </figure>
                </button>
              </div>
            </form>
            <p className={message ? "section--message" : " hidden"}>Please enter a valid date</p> 
          </section>
          <section className='section--output'>
            <p>
              <span>
                {!error ? totalYears : "--"}
              </span>
              years
            </p>
            <p>
              <span>
                {!error ? totalMonths : "--"}
              </span>
              months
            </p>
            <p>
              <span>
                {!error ? totalDays : "--"}
              </span>
              days
            </p>
          </section>
        </article> 
      </main>
    </>
  )
}

export default App
