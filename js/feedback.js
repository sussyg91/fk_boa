const sendFeedback = (e) => {
  const name = document.querySelector('#name').value
  const email = document.querySelector('#email').value
  const subject = document.querySelector('#subject').value
  const comment = document.querySelector('#comment').value

  if( name !='' && email !='' && subject !='' && comment !='') {
    // const url = `./sendFeedback.html?name=${name}&email=${email}&subject=${subject}&comment=${comment}`
    const url = `./sendFeedback.html?feedback={"name":"${name}","email":"${email}","subject":"${subject}","comment":"${comment}"}`
    window.location = url
  } 
}

document.querySelector('#submit-feedback').addEventListener('click', sendFeedback)