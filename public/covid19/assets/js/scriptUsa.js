const form = document.querySelector('form');
form.addEventListener('submit',async (e)=> {
  $('#loaderModal').modal('show');
  e.preventDefault();
  const [
    {value: email},
    {value: password}
  ] = e.target;

  const token = await getToken({ email, password });
  funcionUsa(token)

});

( async()=>{
  const token = localStorage.getItem('token');
  console.log(token)
  if (token) {
    const dataAllUsa = await funcionUsa(token);
    graficarDataAll(dataAllUsa);
  }
})();
const funcionUsa = (async(token)=>{
  try {
    const endUrls= ["confirmed", "deaths", "recovered"];
    const getUsaCDR = endUrls.map(async(endUrl)=>{
      const response = await fetch(`http://localhost:3000/api/${endUrl}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/jason',
          Authorization: `Bearer ${token}`
        }
      });
      const {data} = await response.json();

      return (data);
    });

  const [conf, muer, recu] = await Promise.all(getUsaCDR);

  graficarDataAll([conf, muer, recu]);

  
  const [form, btns] = document.querySelectorAll('#formulario, #buttons');
  form.classList.toggle('d-none');
  btns.classList.toggle('d-none');
  } catch (error) {
    alert("Ha ocurrido un error");
  }
});


const getToken = async (user)=>{
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    body: JSON.stringify(user),
  });
  const {token} = await response.json();
  localStorage.setItem('token', token);
  return token;
};


const graficarDataAll = async (datosCDRUsa) => {
  console.log(datosCDRUsa[0]);

  const feconf = [];
  datosCDRUsa[0].forEach((element)=>{
    feconf.push(element.date)
  }) 
  const [conf, muer, recu] = datosCDRUsa.map((element) => {
    return element.map((data) => data.total);
  });

  const datosUsaConfirmados = {
    label: "Datos de Confirmados",
    data: conf,
    backgroundColor: 'rgba(54, 162, 235, 0.2)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1,
  };

  const datosUsaMuertes = {
    label: "Datos de Muertes",
    data: muer,
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
    borderColor: 'rgba(255, 0, 0, 1)',
    borderWidth: 1,
  };

  const datosUsaRecuperados = {
    label: "Datos de Recuperados",
    data: recu,
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
    borderColor: 'rgba(0, 255, 0, 1)',
    borderWidth: 1,
  };
  const $graficaUsa = document.querySelector('#graficUsa')
  new Chart($graficaUsa, {
    type: 'line',
    data: {
      labels: feconf,
      datasets: [datosUsaConfirmados, datosUsaMuertes, datosUsaRecuperados
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }],
      }
    },
  })
  setTimeout(() => {
    $('#loaderModal').modal('hide');
  }, 200);
};

document.getElementById("cerrarUsaCovid").addEventListener("click", event => {
  event.preventDefault;
  localStorage.clear();
  location.reload();
});

(async()=>{
  const token = localStorage.getItem('token');
  console.log(token)
  if (token) {
   funcionUsa(token);
   $('#loaderModal').modal('show');

  }
})();

