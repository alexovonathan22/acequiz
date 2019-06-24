$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const myId = urlParams.get('id')
    console.log(myId);
    
        $.ajax({
            type: 'GET',
            url: 'http://localhost:5000/quiz/'+myId,
            
            success: function(data){            
               
                $('#showone').append(`
                  <br> <li> id: ${data.id}.  ${data.question}</li><br>
                  <li>${data.option1}</li>
                  <li>${data.option2}</li>
                  <li>${data.correct_answer}</li>
                `)
                // window.location.href = 'http://localhost:5000/success.html';
            
            }

        });
        // console.log(url)
   
});