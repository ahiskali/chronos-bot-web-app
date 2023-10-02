const weekdays = {
  "Mon": '1',
  "Tue": '2',
  "Wed": '3',
  "Thu": '4',
  "Fri": '5',
  "Sat": '6',
  "Sun": '7'
}

const hours = {
  "00:00": '0',
  "01:00": '1',
  "02:00": '2',
  "03:00": '3',
  "04:00": '4',
  "05:00": '5',
  "06:00": '6',
  "07:00": '7',
  "08:00": '8',
  "09:00": '9',
  "10:00": '10',
  "11:00": '11',
  "12:00": '12',
  "11:00": '11',
  "12:00": '12',
  "13:00": '13',
  "14:00": '14',
  "15:00": '15',
  "16:00": '16',
  "17:00": '17',
  "18:00": '18',
  "19:00": '19',
  "20:00": '20',
  "21:00": '21',
  "22:00": '22',
  "23:00": '23'
}

class CronExpression {
  constructor() {
    this.minutes = ['0']
    this.hours = ['*']
    this.days = ['*']
    this.months = ['*']
    this.weekdays = ['*']
    this.element = document.createElement("p")

    this.update_dom()
    this.element
  }

  cron_expression() {
    return `${this.minutes.join(',')} ${this.hours.join(',')} ${this.days.join(',')} ${this.months.join(',')} ${this.weekdays.join(',')}`
  }

  add(type, number) {
    switch (type) {
      case 'hours':
        if (this.hours.toString() == ['*'].toString()) {
          this.hours = [number]
        } else {
          this.hours.push(number)
        }
        break
      case 'weekdays':
        if (this.weekdays == ['*'].toString()) {
          this.weekdays = [number]
        } else {
          this.weekdays.push(number)
        }
        break
      default:
        console.log(`wrong type ${type}`)
    }

    this.update_dom()
  }

  remove(type, number) {
    switch (type) {
      case 'hours':
        this.hours = this.hours.filter(x => x !== number);

        if (this.hours.length === 0) {
          this.hours = ['*']
        }

        break
      case 'weekdays':
        this.weekdays = this.weekdays.filter(x => x !== number);

        if (this.weekdays.length === 0) {
          this.weekdays = ['*']
        }
        break
      default:
        console.log(`wrong type ${type}`)
    }

    this.update_dom()
  }

  update_dom() {
    this.element.textContent = 'Reminder will be sent ' + cronstrue.toString(this.cron_expression(), { verbose: true, use24HourTimeFormat: true })
  }
}

cron = new CronExpression
document.querySelector("#cron").replaceWith(cron.element);

class CustomSelect {
  constructor(options, className) {
    this.customSelect = document.createElement("div");
    this.customSelect.classList.add("select");
    this.customSelect.classList.add(className);

    for (const [name, value] of Object.entries(options)) {
      const itemElement = document.createElement("div");

      itemElement.classList.add("select__item");
      itemElement.textContent = name;
      this.customSelect.appendChild(itemElement);

      itemElement.addEventListener("click", () => {
        if (itemElement.classList.contains("select__item--selected")) {
          this._deselect(itemElement);
        } else {
          this._select(itemElement);
        }
      });
    };

    return this.customSelect
  }

  _select(itemElement) {
    itemElement.classList.add("select__item--selected");
    var element_type = itemElement.parentNode.classList[1]
    let dict
    switch (element_type) {
      case 'hours':
        dict = hours
        break
      case 'weekdays':
        dict = weekdays
        break
    }
    cron.add(element_type, dict[itemElement.textContent])
  }

  _deselect(itemElement) {
    itemElement.classList.remove("select__item--selected");
    var element_type = itemElement.parentNode.classList[1]
    let dict
    switch (element_type) {
      case 'hours':
        dict = hours
        break
      case 'weekdays':
        dict = weekdays
        break
    }
    cron.remove(element_type, dict[itemElement.textContent])
  }
}

weekdays_element = new CustomSelect(weekdays, 'weekdays');
hours_element = new CustomSelect(hours, 'hours');
document.querySelector("#weekdays").replaceWith(weekdays_element);
document.querySelector("#hours").replaceWith(hours_element);

confirm_button = document.querySelector("#confirm_button")

confirm_button.addEventListener("click", () => {
  data = {
    action: 'create_reminder',
    cron: cron.cron_expression(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    question: document.querySelector("#form").value
  }

  Telegram.WebApp.sendData(JSON.stringify(data))
  Telegram.WebApp.close()
});

Telegram.WebApp.ready()
