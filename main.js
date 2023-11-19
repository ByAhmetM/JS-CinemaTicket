//*Tıklanılan koltuğa ulaşmak için container divini çek
//* containera bir olay dinleyicisi ekle(addEventListener)
//!HTML'den gelenler
const container = document.querySelector(".container");
const infoText = document.querySelector(".infoText");
const totalSeatCount = document.querySelector("#count");
const totalPrice = document.querySelector("#amount");
const movieSelect = document.querySelector("#movie");
const screenImg = document.querySelector("#screenImg");
const allSeats = document.querySelectorAll(".seat:not(.reserve)");

//* verileri locale kaydetme
const saveToDatabase = (willSaveIndex) => {
  //*veriyi json formatına çevirme
  const jsonIndex = JSON.stringify(willSaveIndex);
  //* veri tabanına koltukları kayıt etme
  localStorage.setItem("seatIndex", jsonIndex);
  //*filmleri veri tabanına locale kaydetme
  localStorage.setItem("movieIndex", JSON.stringify(movieSelect.selectedIndex));
};

//*verileri localden çekme
const getFromDatabase = () => {
  const dbSelectedIndex = JSON.parse(localStorage.getItem("seatIndex"));
  if (dbSelectedIndex !== null) {
    allSeats.forEach((seat, index) => {
      if (dbSelectedIndex.includes(index)) {
        seat.classList.add("selected");
      }
    });
  }
  const dbSelectedMovie = JSON.parse(localStorage.getItem("movieIndex"));

  movieSelect.selectedIndex = dbSelectedMovie;
};

getFromDatabase();

//* koltukların ve seçilen koltukların indexini bulma sıra numarasını bulma
const createIndex = () => {
  const allSeatsArray = [];
  allSeats.forEach((seat) => {
    allSeatsArray.push(seat);
  });
  const selectedSeats = container.querySelectorAll(".seat.selected");
  const allSelectedSeatsArray = [];
  selectedSeats.forEach((selectedSeat) => {
    allSelectedSeatsArray.push(selectedSeat);
  });

  const selectedIndex = allSelectedSeatsArray.map((selectedSeat) => {
    return allSeatsArray.indexOf(selectedSeat);
  });

  saveToDatabase(selectedIndex);
};

/* imageler için srcleri dinamik hale getirmek 
için dizi oluşturdum her bir valueya bir src verdim */
const imgSrc = {
  100: "https://www.otekisinema.com/wp-content/uploads/2016/08/behzat_c_seni_kalbime_gomdum-poster.jpg",
  200: "https://upload.wikimedia.org/wikipedia/tr/0/07/%C4%B0%C5%9Fler_G%C3%BC%C3%A7ler.jpg",
  300: "https://i.ytimg.com/vi/eIdvfppVIiY/maxresdefault.jpg",
};

//? Olay izleyicileri

//* container içerisindeki her bir koltuğa tıklandığında selected yap ve hesaplama fonk çalıştır
container.addEventListener("click", (e) => {
  const clickedSeat = e.target.closest("div");
  if (
    clickedSeat.classList.contains("seat") &&
    !clickedSeat.classList.contains("reserve")
  ) {
    clickedSeat.classList.toggle("selected");
  }

  calculateTotal();
});

//* selectteki optionlar her değiştiğinde fiyatı güncelle ve resmi güncelle
movieSelect.addEventListener("change", () => {
  calculateTotal();
  screenImg.src = imgSrc[movieSelect.options[movieSelect.selectedIndex].value];
});

//todo Toplam fiyat hesaplama fonksiyonu

function calculateTotal() {
  createIndex();
  const selectedSeatCounts =
    container.querySelectorAll(".seat.selected").length;
  totalSeatCount.innerText = selectedSeatCounts;
  let selectedMoviePrice = movieSelect.options[movieSelect.selectedIndex].value;

  totalPrice.innerText = selectedSeatCounts * selectedMoviePrice;

  if (selectedSeatCounts) {
    infoText.classList.add("open");
  } else {
    infoText.classList.remove("open");
  }
}

calculateTotal();
