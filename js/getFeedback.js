const isNoFeedback = window.location.search == ''
let search = window.location.search.replaceAll('?feedback=','')
search = search.replaceAll('%22','"')

console.log("isNoFeedback: "+ isNoFeedback)
if(isNoFeedback) {
  window.location = './feedback.html'
}

const jsonFeedback = JSON.parse(search)
console.log("Feedback:")
console.log(jsonFeedback)

const feedbackMessage = `Hello <b>${jsonFeedback.name}</b>.\n
Thank you for your comments.\n
They will be reviewed by our Customer Service staff and given the full attention that they deserve.\n
You will receive a response to the specified email: <b>${jsonFeedback.email}</b>.\n`

// set feedback content
document.querySelector('.feedback-content').innerHTML = feedbackMessage