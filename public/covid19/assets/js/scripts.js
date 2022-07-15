// http://localhost:3000/api/total
// https://covid2019-api.herokuapp.com/v2/timeseries/deaths

const getCovidCases = async () => {
  $('#loaderModal').modal('show');
  const url = "/api/total";
  try {
    const response = await fetch(url);
    const cases = await response.json();
    const data = cases.data;
    graficarData(data);
    getCovidTable(data);
  } catch (err) {
    console.log(err);
  }
};

getCovidCases();

const graficarData = (data) => {
  const confirmados = [];
  const muertes = [];
  const recuperados = [];
  const activos = [];

  data.slice(0,10).forEach(({location, confirmed, deaths, recovered, active})=>{
    confirmados.push({
      label: location,
      y: confirmed,
  })
    muertes.push({
      label: location,
      y: deaths,
  })
    recuperados.push({
      label: location,
      y: recovered,
  })
    activos.push({
      label: location,
      y: active,
  })

  var chart = new CanvasJS.Chart("graficMundial", {
    animationEnabled: true,
    theme: "light2",
    title:{
        text: "Paises con Covid19",
        padding: 10,
    },
    axisY: {
        title: ""
    },
    legend: {
        verticalAlign: "top",
        fontSize: 14,
        padding: 100,
    },
    data: [{        
        type: "column",  
        showInLegend: true,
        color: "turquoise",
        legendMarkerColor: "turquoise",
        legendText: "Casos activos",
        dataPoints: activos,
    },{        
        type: "column",  
        showInLegend: true,
        color: "gold",
        legendMarkerColor: "gold",
        legendText: "Casos confirmados",
        dataPoints: confirmados,
    },
    {
        type: "column",  
        showInLegend: true,
        color: "red",
        legendMarkerColor: "red",
        legendText: "Casos muertos",
        dataPoints: muertes,
    },
    {
        type: "column",  
        showInLegend: true,
        color: "blue",
        legendMarkerColor: "blue",
        legendText: "Casos recuperados",
        dataPoints: recuperados,
    }],
});
chart.render();
setTimeout(() => {
  $('#loaderModal').modal('hide');
}, 800);
  });
};

const getCovidTable = (data) => {
document.querySelector('tbody').innerHTML = "";

data.sort((a, b) => {
  if (a.location > b.location) {
    return 1;
  }
  if (a.location < b.location) {
    return -1;
  }
  return 0;
});

data.forEach((p, i) => {
  document.querySelector('tbody').innerHTML += `
  <tr>
  <td scope="col">${p.location}</th>
  <td scope="col">${p.active}</th>
  <td scope="col">${p.confirmed}</th>
  <td scope="col">${p.deaths}</th>
  <td scope="col">${p.recovered}</th>
  <td scope="col"><button type="button" onclick="covidModal('${p.location}')" data-toggle="modal" data-target="#exampleModal" class="btn btn-outline-primary btn-sm">Detalles</button>
  </th>
</tr>
  `;
})
};

window.covidModal = async(country) => {
  console.log(country);
  const response = await fetch(`/api/countries/${country}`);
  const data = await response.json();
  console.log(data.data.active);

let config = {
  animationEnabled: true,
  title: {
    text: `Estadisticas de ${data.data.location}`
  },
  axisY: {
    title: "Valor"
  },
  axisX: {
    title: "Estadisticas"
  },
  data: [
    {
      type: "pie",
      indexLabel: "{label} - {y}",
      dataPoints: [
        { y: data.data.active },
        { y: data.data.confirmed },
        { y: data.data.deaths },
        { y: data.data.recovered }
        ]
    },
  ],
};

let chart = new CanvasJS.Chart("modal", config);

chart.render();

};


