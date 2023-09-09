// TODO
//


// .warning {
//       margin-left: 4px;
//       color: red;
//       font-weight: bolder;
//     }
    
//     .clock {
//       margin-left: 4px;
//     }
//     .clock a {
//       color: rgb(50, 107, 107)!important;
//     }
    
//     #start-action {
//       margin-left: 4px!important;
//     }
    
//     .stats-title {
//       color: white;
//     }
//     .stats-container {
//       width: 100%;
//       min-height: 300px;
//       background-color: rgb(75, 75, 75);
//       position: relative;
//       margin-bottom: 30px;
//     }
    
//     .stats-container * {
//       color: white;
//     }
    
//     .dot {
//       position: absolute;
//     }
//     .time {
//       position: absolute;
//     }




window.addEventListener('load', function () {

      formSubmitHandler()

      startActionToggle()
      startAction()
      addLearningToMenu()
      getStatsData()
      parseStatsData()

      var time = new Date(localStorage.getItem('time'))
      var diff = Math.abs(new Date() - time)
      var seconds = Math.floor((diff/1000));
      addNotificationToNow(seconds)
})


var state = {
      state: 'new',
      seconds: 0,
}

function formSubmitHandler () {
      const form = document.querySelectorAll("form");
      if (form.length > 1) {
            [...form].forEach(item => {
                  item.addEventListener('submit', handleSubmit)
            })
      }
}

function handleSubmit (event) {
     // event.preventDefault();
      var search = new URLSearchParams(document.location.search)
      var id = search.get("id")
      saveDone(id)
}

function saveDone(id) {
      var done = getDone()

      done.indexOf(id) === -1 ? done.push(id) : true

      window.localStorage.setItem('done', JSON.stringify(done))
}

function getDone () {
      var done = []
      var storage = window.localStorage.getItem('done')
      if(storage) {
            done = JSON.parse(storage)
      }
      return done
}

function resetDone () {
      window.localStorage.setItem('done', JSON.stringify([]))
}

async function addNotificationToNow (seconds) {
      (async () => {
            var todoPage = null
            if (seconds > 30) {
                  state.state = 'new'
                  
                  var response = await fetch('?id=182');
                  switch (response.status) {
                        // status "OK"
                        case 200:
                              todoPage = await response.text(); 
                              
                              if (todoPage.includes('Je hebt niet genoeg rechten om deze pagina te bekijken!')) {
                                    console.error('No rights to view todo page');
                                    todoPage = null
                              } else {
                                    localStorage.setItem('time', new Date())
                                    localStorage.setItem('todoPage', JSON.stringify(todoPage))
                                    resetDone()
                              }

                              break;
                        // status "Not Found"
                        case 404:
                              console.error('Not Found');
                              break;
                  }
            } else {
                  state.state = 'old'
                  state.seconds = seconds
                  todoPage = JSON.parse(localStorage.getItem('todoPage'))
            }

            if (!todoPage) {
                  return
            }

            var done = getDone()

            noticeItems.forEach((item) => {
                  if (done.includes(item.pageId)) {return}
                  
                  var index = todoPage.lastIndexOf(', "'+item.toDoId+'",')
                  var before_ = todoPage.substring((index - 15), index)
                  var seconds = Number(before_.split('( ')[1])

                  if(isNaN(seconds)) {return}
                  
                  if (state.state === 'old') {
                        seconds = seconds - state.seconds
                  }

                  if (seconds < 0) {
                        addNoticeToMenu(item.pageId)
                  } else {
                        var parent = document.querySelector("a[href='?id="+item.pageId+"']#menu")

                        if (!parent) {
                              return
                        }

                        addClock(parent, item, seconds)
                  }
            })

            addMatchWarning(todoPage, 'Groepswerk meedoen', '0 / 1', '299')
            addMatchWarning(todoPage, 'Groepswerk starten', '0 / 1', '299')
            addMatchWarning(todoPage, 'Lot kopen', 'Mogelijk', '66')
            addMatchWarning(todoPage, 'Extra lot kopen', 'Mogelijk', '66')
            addMatchWarning(todoPage, 'RE instellen', 'Mogelijk', '80')
            addMatchWarning(todoPage, 'Gangchaos starten mogelijk', false, '155')
            addMatchWarning(todoPage, 'Gangwerk meedoen mogelijk', false, '155')
            addMatchWarning(todoPage, 'Gangwerk starten mogelijk', false, '155')
            addMatchWarning(todoPage, 'Naar de les gaan mogelijk', false, '323')

      })();
}

async function addMatchWarning (todoPage, matchString, matchMatch, pageId) {
      if (matchMatch) {
            var pageMatch = todoPage.lastIndexOf(matchString)
            pageMatch = todoPage.substring((pageMatch + 300), pageMatch)
            pageMatch = pageMatch.split(matchMatch)
      } else {
            var pageMatch = todoPage.split(matchString)
      }

      if (pageMatch.length > 1) {
            addNoticeToMenu(pageId)
      }
}

async function startActionToggle () {
      var firstMenu = document.querySelectorAll('.MenuCat')[0]
      var toggle = document.createElement('input')
      var br = document.createElement('br')
      var p = document.createElement('span')
      p.innerText = 'Start acties'
      startActionStatus = Number(window.localStorage.getItem('startActionStatus'))
      toggle.type = 'checkbox'
      toggle.id = 'start-action'
      toggle.checked = startActionStatus === 1 ? true : false
      firstMenu.after(toggle)
      firstMenu.after(p)
      firstMenu.after(br)

      document.getElementById('start-action').addEventListener('change', (event) => {
            console.log(event, startActionStatus)
            startActionStatus ? startActionStatus = 0 : startActionStatus = 1
            window.localStorage.setItem('startActionStatus', startActionStatus)
            if (startActionStatus) {
                  startAction()
            }
      })
}
var startActionStatus

async function startAction () {
      if (startActionStatus != 1) {
            return
      }

      var search = new URLSearchParams(document.location.search)
      var id = search.get("id")
      var p = search.get("p")
      var code = document.querySelector('[name="code"]')

      if (code) {
            var img = document.querySelector('img[src*="docs/code.php"]')
            var codeNumber = img.src.split('=')[1]
            code.value = codeNumber
      }

      if (id === '325') {
            var buttons = document.querySelectorAll('.col-sm-8.col-xs-12 [type="submit"]')
            if (buttons.length > 0 && buttons[1].classList.contains('disabled')) {
                  var button = buttons[0] 
            } else {
                  var button = buttons[1] 
            }
      } else if (id === '324') {
            var isBusy = document.querySelector('#LeerTimer')
            if (isBusy) return

            var wrongPage = search.get("vak")
            if (wrongPage) window.location.href = "?id=324"

            var vakken = document.querySelectorAll('ul:not(.dropdown-menu):not(.nav) li')
            var last = Number(window.localStorage.getItem('lastLeerwerk'))
            if (last >= 3) last = -1
            vakken[last+1].querySelector('a').click()

            saveDone('324')
            window.localStorage.setItem('lastLeerwerk', last+1)
      } else if (id === '327') {
            var button = document.querySelector('form[name="BedrijfsForm"] input[type="submit"]')
            if (button && button.value !== 'Ga produceren!') {
                  button = null
            }
      } else if (id === '133') {
            var button = document.querySelector('form input[type="submit"][name="huiswerk_maken"]')
            if (!button) {
                  button = document.querySelector('form input[type="submit"][name="werk_vooruit"]')
            }
      } else {
            var button = document.querySelector('.col-sm-8.col-xs-12 [type="submit"]')
      }
      if(autoArray.includes(id) && button && !p) {
            setTimeout(()=>{
                  button.click()
            }, Math.floor(Math.random() * (1000 - 800 + 1) + 800))
      }
}

async function addLearningToMenu () {
      var hw = document.querySelector("a[href='?id=133']#menu")

      if (!hw) {
            return
      }

      var lerenlink = document.createElement('a')
      lerenlink.appendChild(document.createTextNode("leerwerk"));
      lerenlink.href ='?id=324'
      lerenlink.id = 'menu'

      var br = document.createElement('br')
      hw.parentNode.insertBefore(lerenlink, hw.nextSibling);
      lerenlink.parentNode.insertBefore(br, lerenlink);
}

async function addClock (parent, item, seconds) {
      var clock = document.createElement('span')
      clock.classList.add('clock')
      clock.id = (item.toDoId)
      parent.appendChild(clock)
      
      var s = document.createElement("script");
      s.innerText = 'display( '+seconds+', "'+item.toDoId+'", "'+item.pageId+'", "1", true )' 
      parent.append(s)
}

var addNoticeToMenu = function (pageId) {
      var item = document.querySelector("a[href='?id="+pageId+"']#menu")

      if (!item) {
            return
      }
      var warning = document.createElement('span')
      warning.classList.add('warning')
      warning.innerHTML = '❗️'
      item.appendChild(warning)
}


var autoArray = [
      '82', // werk
      '222', // trainen
      '163', // bijbaan
      '319', // pw's verkopen
      '323', // les
      '325', // stelen
      '327', // produceren
      '133', // HW
]
var noticeItems = [
      {
            toDoId: 'd', //werken
            pageId: '82'
      },{
            toDoId: 'd2', //HW 
            pageId: '133'
      },{
            toDoId: 'd3', //HW vooruit
            pageId: '133'
      },{
            toDoId: 'd4', //HW verkopen
            pageId: '133'
      },{
            toDoId: 'd6', //bedrijf
            pageId: '327'
      },{
            toDoId: 'd8', //PWs
            pageId: '319'
      },{
            toDoId: 'd5', //leren
            pageId: '324'
      },{
            toDoId: 'd9', //stelen
            pageId: '325'
      },{
            toDoId: 'd1', //bijbaan
            pageId: '163'
      },{
            toDoId: 'd10', //trainen
            pageId: '222'
      },{
            toDoId: 'd-chaos', //chaos
            pageId: '25'
      },

]

async function getStatsData () {

      var lastTime = window.localStorage.getItem('lastTimeStats')
      lastTime = new Date(lastTime)

      // make a date object that is now minus 1 hour
      var now = new Date()
      now = now.setHours(now.getHours() - 1)
      console.log(lastTime, now)

      // check if its longer than an hour
      if (lastTime >= now) return

      var oldData = window.localStorage.getItem('statsData')
      if (!oldData) {
            oldData = []
      } else {
            oldData = JSON.parse(oldData)
      }
      
      var htmlString = ''

      var response = await fetch('?id=208');
      switch (response.status) {
            // status "OK"
            case 200:
                  htmlString = await response.text(); 

                  break;
            // status "Not Found"
            case 404:
                  console.error('Not Found');
                  break;
      }

      const parser = new DOMParser();
      const html = parser.parseFromString(htmlString, 'text/html');
      const body = html.body;

      console.log(body);
      var search = new URLSearchParams(document.location.search)
      var id = search.get("id")
      // if (id !== '208') return
      var data = {}

      var all = body.querySelectorAll('.col-sm-8 [width="35%"]')

      data.time = new Date()

      data.euro =       Number(all[0].textContent.split(' ')[1])
      data.chaos =      Number(all[1].textContent.split(' ')[0])
      data.gezondheid = Number(all[2].textContent.split('%')[0])
      data.straf =      Number(all[3].textContent.split(' ')[0])
      data.verdediging = Number(all[4].textContent.split(' ')[0])
      data.aanval =     Number(all[5].textContent.split(' ')[0])
      data.kluisjes =   Number(all[6].textContent.split(' ')[1])
      data.respect =    Number(all[7].textContent.split(' ')[0])

      data.armkracht = Number(body.querySelector('.container .col-sm-8 :nth-child(12) > :last-child').textContent)
      data.beenkracht = Number(body.querySelector('.container .col-sm-8 :nth-child(13) > :last-child').textContent)
      data.conditie = Number(body.querySelector('.container .col-sm-8 :nth-child(14) > :last-child').textContent)

      console.log(data)

      oldData.push(data)

      window.localStorage.setItem('lastTimeStats', new Date())
      window.localStorage.setItem('statsData', JSON.stringify(oldData))
}

async function parseStatsData () {
      var statsData = window.localStorage.getItem('statsData')
      statsData = JSON.parse(statsData)
      console.log(statsData)

      for (var key in statsData[0]) {
            console.log(key)
            if (key === 'time') continue
            
            var title = document.createElement('p')
            title.classList.add("stats-title")
            title.innerText = key
            document.body.appendChild(title)
            var elemDiv = document.createElement('div')
            elemDiv.classList.add("stats-container")
            document.body.appendChild(elemDiv)

            var low = statsData.reduce(function(prev, curr) {
                  return prev[key] < curr[key] ? prev : curr;
            });
            var high = statsData.reduce(function(prev, curr) {
                  return prev[key] > curr[key] ? prev : curr;
            });
            console.log(low,high)

            statsData.forEach((item, i) => {
                  var el = createStatsItem(item[key], 'dot')
                  var timeContent = new Date(item['time']).toLocaleDateString('nl', {day: '2-digit', month: '2-digit'}) +' '+ new Date(item['time']).toLocaleTimeString('nl', {hour: '2-digit', minute:'2-digit'})
                  var time = createStatsItem(timeContent, 'time')

                  el.style.left = 100 * i /statsData.length + '%'
                  time.style.left = 100 * i /statsData.length + '%'
                  el.style.bottom = 100 * (item[key]-low[key]) / (high[key]-low[key]+((high[key]-low[key])/10)) + '%'
                  time.style.bottom = '-20px'
                  elemDiv.appendChild(el)
                  elemDiv.appendChild(time)
            })
      }

}

function createStatsItem (content, htmlClass) {
      var el = document.createElement('div')
      el.classList.add(htmlClass)
      el.innerText = content
      return el
}
