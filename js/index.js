const app = {
	showdata: function() {
		const dataDefault = [
			{
				nameRestaurant: 'Lauphan',
				typeOfRestaurant: 'Buffet',
				time: '12:47 PM',
				date: '20-10-20',
				avePrice: 300,
				rate: 4,
				nameOfReporter: 'Tuan'
			},
			{
				nameRestaurant: 'adasd',
				typeOfRestaurant: 'Buffet',
				time: '12:47 PM',
				date: '20-10-20',
				avePrice: 300,
				rate: 4,
				nameOfReporter: 'Tuan'
			}
		];
		var db;
		var request = window.indexedDB.open('DatabaseIrate', 1);
		// onError
		request.onerror = function(event) {
			console.log('error: ');
		};
		// Connect DB success
		request.onsuccess = function(event) {
			db = request.result;
			readAll();
			console.log('success: ' + db);
		};

		// Update DB
		request.onupgradeneeded = function(event) {
			var db = event.target.result;
			var objectStore = db.createObjectStore('restaurants', { keyPath: 'nameRestaurant' });
			for (var i in dataDefault) {
				objectStore.add(dataDefault[i]);
			}
		};

		// read all
		function readAll() {
			var objectStore = db.transaction('restaurants').objectStore('restaurants');

			objectStore.openCursor().onsuccess = function(event) {
				var cursor = event.target.result;
				if (cursor) {
					const listFb = /*html */ `<div class="content-list">
						<div class="content__img"> <img src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?cs=srgb&dl=pexels-pixabay-262978.jpg&fm=jpg" alt=""/></div>
						<div>
							<div class="txt">Name of restaurant: <span>${cursor.value.nameRestaurant}</span></div>
							<div class="txt">Type of Restaurant: <span>${cursor.value.typeOfRestaurant}</span></div>
							<div class="txt">Rate: <span>${cursor.value.rate}star</span></div>
							<div class="txt">Reporter: <span>${cursor.value.nameOfReporter}star</span></div>
						</div>
						<div class="button">
								<input type="button" class="btn btn-secondary" id="delete"/>
								<button class="btn btn-primary">ViewDetail</button>
						</div>
					</div>`;
					const contentEl = document.getElementById('content');
					contentEl.insertAdjacentHTML('beforeend', listFb);
					cursor.continue();
				}
			};
		}

		function loadDetail() {
			var id = document.URL.split('=')[1];
			var transaction = db.transaction([ 'restaurants' ]);
			var objectStore = transaction.objectStore('restaurants');
			var request = objectStore.get(parseInt(id));

			request.onerror = function(event) {
				alert('Unable to retrieve daa from database!');
			};

			request.onsuccess = function(event) {
				$('.name').text(request.result.restaurant_name);
				$('.type').text(request.result.restaurant_type);
				$('.datetime').text(request.result.date_time);
				$('.avgPrice').text(request.result.ave_meal_price);
				$('.note').text(request.result.notes);
				$('.reporter').text(request.result.reporter_name);
				$('.rate').text(request.result.rating);
			};
		}

		// add
		function add(
			nameRestaurantVal,
			typeOfRestaurantVal,
			timeVal,
			dateVal,
			avePriceVal,
			rateVal,
			nameOfReporterVal
		) {
			const idVal = function() {
				return '_' + Math.random().toString(36).substr(2, 9);
			};
			var request = db.transaction([ 'restaurants' ], 'readwrite').objectStore('restaurants').add({
				id: idVal(),
				nameRestaurant: nameRestaurantVal,
				typeOfRestaurant: typeOfRestaurantVal,
				time: timeVal,
				date: dateVal,
				avePrice: avePriceVal,
				rate: rateVal,
				nameOfReporter: nameOfReporterVal
			});

			request.onsuccess = function(event) {
				alert('this feedback has been added to your database.');
			};

			request.onerror = function(event) {
				alert(`Unable to add data\r\n${id} is aready exist in your database! `);
			};
		}
		//Delete Feedback
		function remove(id) {
			var request = db.transaction([ 'restaurants' ], 'readwrite').objectStore('restaurants').delete(id);

			request.onsuccess = function(event) {
				alert('prasad entry has been removed from your database.');
				window.location = 'index.html';
			};
		}
		const onFeedback = document.querySelector('.submitt');
		onFeedback &&
			onFeedback.addEventListener('click', function() {
				const sum =
					parseInt(document.querySelector('#rateservice').value) +
					parseInt(document.querySelector('#ratecleanliness').value) +
					parseInt(document.querySelector('#ratefood').value);
				const rateStar = (sum / 3).toFixed(1);
				var nameRestaurant = document.querySelector('#name').value;
				var typeOfRestaurant = document.querySelector('#types').value;
				var time = document.querySelector('#time').value;
				var date = document.querySelector('#date').value;
				var avePrice = document.querySelector('#price').value;
				var rate = rateStar;
				var nameOfReporter = document.querySelector('#namereporter').value;
				if (document.myForm.Name.value == '') {
					return false;
				}
				if (document.myForm.types.value == '') {
					return false;
				}
				if (document.myForm.time.value == '') {
					return false;
				}
				if (document.myForm.date.value == '') {
					return false;
				}
				if (document.myForm.price.value == '') {
					return false;
				}
				if (document.myForm.rateservice.value == '') {
					return false;
				}
				if (document.myForm.ratecleanliness.value == '') {
					return false;
				}
				if (document.myForm.ratefood.value == '') {
					return false;
				}
				if (document.myForm.namereporter.value == '') {
					return false;
				}
				add(nameRestaurant, typeOfRestaurant, time, date, avePrice, rate, nameOfReporter);
			});
	}
};

app.showdata();
