import Vue from 'vue';
import Vuex from 'vuex';
import uuid4 from 'uuid4';
import {router} from '../routes.js'
import {convStrip,convSet} from '../components/stringlib.js';

import {
  json1,
  json2,
  json3
} from './jsons.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    client_id: "",
    objActive: "0",
    data: {},

    actors: {
      active: "",
      list: []
    },
		warning:{
			stat: false,
			title: "",
			message: ""
		},
    socket: {
      request_id: 0,
      wait: {
        req: false,
        note: "",
        error: false,
        id: false,
        type: "",
        message: "",
        show: false
      },
//      serverAddress: "10.42.0.1:8000",
      serverAddress: "localhost:8000",
      isConnected: false,
      message: '',
      reconnectError: false,
    }
  },
  getters: {
    socketGet(state) {
      return state.socket;
    },
    actorsGet(state) {
      return state.actors;
    },
    warningGet(state) {
      return state.warning;
    },
    oneObject(state){
			if(state.route.path.substring(1,state.route.path.length) in state.data)
			{
				return state.data[state.route.path.substring(1,state.route.path.length)];
			}
			else return false;
    },
		allObjects(state){
			return state.data;
		},
		menuObject(state) {
      if("menu" in state.data)
      {
        return {key:Math.random(), obj:state.data.menu};
      }
      else return false;
		},
		routerPath(state){
			return state.route;
		}
  },
  mutations: {
		warningReset(state){
			state.warning.stat=false;
			state.warning.title="";
			state.warning.message="";
		},
    sockReqIdIncr(state) {
      state.socket.request_id++;
    },
    sockWaitSet(state, lset) {
      if ("req" in lset) state.socket.wait.req = lset.req;
      if ("note" in lset) state.socket.wait.note = lset.note;
      if ("error" in lset) state.socket.wait.error = lset.error;
      if ("id" in lset) state.socket.wait.id = lset.id;
      if ("type" in lset) state.socket.wait.type = lset.type;
      if ("message" in lset) state.socket.wait.message = lset.message;
      if ("show" in lset) state.socket.wait.show = lset.show;
    },
    servAddressSet(state, lserv) {
      state.socket.serverAddress = lserv;
    },
    actorsActiveSet(state, lactor) {
      console.log("! " + lactor);
      state.data = Object.assign({});
      state.actors.active = lactor;
      localStorage.actorActive = lactor;
    },
    dataListFill(state, lstr) {
      let lobj = JSON.parse(lstr).list.objects;
      let lobj2 = {};
      for (let l in lobj) {

        lobj2[lobj[l].id] = {
          object: lobj[l]
        };
      }
      state.data = Object.assign({}, state.data, lobj2);
    },
    dataFill(state, lstr) {
      let lobj = lstr;
      let lobj2 = {};
      lobj2[lobj.object.id] = lobj;
      state.data = Object.assign({}, state.data, lobj2);
    },
		dataDel(state, lstr) {
			delete state.data[lstr];
		},
    actorsFill(state, lmess) {
      state.actors.list = [].concat(lmess);
      let l_active = "";
      if (state.actors.active !== "") {
        l_active = state.actors.active;
        for (let l = 0; l < state.actors.list.length; l++) {
          if (l_active === state.actors.list[l].id) {
            store.dispatch('sendSetActor', l_active);
            return true;
          }
        }
      }

      if (localStorage.actorActive) {
        if (localStorage.actorActive !== "") {
          l_active = localStorage.actorActive;
          for (let l = 0; l < state.actors.list.length; l++) {
            if (l_active === state.actors.list[l].id) {
              store.dispatch('sendSetActor', l_active);
              return true;
            }
          }
        }
      }
      if (state.actors.list.length === 1) {
        store.dispatch('sendSetActor', state.actors.list[0].id);
        return true;
      }
      localStorage.actorActive = "";
      state.actors.active = "";
    },
    //добавляем необходимые поля в объект правильным образом
    parSet(state, payload) {
      let lact = payload.obj.actions[payload.actid];
      if ("valid" in lact) return false;
      else {
        if ("user_params" in lact) {
          Vue.set(lact, 'valid', 0);
          let lpar;
          for (lpar in lact.user_params) {
            Vue.set(lact.user_params[lpar], 'value', NaN);
            Vue.set(lact.user_params[lpar], 'valid', 0);
          }
        } else Vue.set(lact, 'valid', 1);
      }
      return true;
    },
    //изменяем поля объекта, по мере заполнения параметров
    parChange(state, payload) {
      let lact = payload.objInfo.obj.actions[payload.objInfo.actid];
      let lpar;
      let lvalid = 1;
      for (lpar in lact.user_params) {
        if (lact.user_params[lpar].code == payload.data.code) {
          lact.user_params[lpar].value = payload.data.value;
          lact.user_params[lpar].valid = payload.data.valid;
        }
        lvalid = lvalid * lact.user_params[lpar].valid;
      }
      lact.valid = lvalid;
    },
    SOCKET_ONOPEN(state, event) {
      Vue.prototype.$socket = event.currentTarget;
      console.log("OPEN!");
      state.socket.isConnected = true;
      store.dispatch('sendGetActors');
    },
    SOCKET_ONCLOSE(state, event) {
      console.log("CLOSE!");

      state.socket.isConnected = false;
    },
    SOCKET_ONERROR(state, event) {
      console.error(state, event)
    },
    SOCKET_RECONNECT(state, count) {
      console.log("RECONNECT!");

    },
    SOCKET_RECONNECT_ERROR(state) {
      console.log("RECONNECT_ERROR!");
      state.socket.reconnectError = true;
    },
    gotError(state, message) {
      console.log("Ошибка: " + state.socket.wait.message);
      store.commit('sockWaitSet', {
        error: "ОШИБКА! Обратитесь к мастеру!" +
          "<br>Sent: " + state.socket.wait.message +
          "<br>Got: " + JSON.stringify(message)
      });
      clearTimeout(state.socket.wait.id);
    },
    gotOk(state) {
      clearTimeout(state.socket.wait.id);
      store.commit('sockWaitSet', {
        req: false,
        id: false,
        type: "",
        error: false,
        note: "",
        message: "",
        show: false
      });
    },
		replyObject(state, message){
			store.commit('dataFill', message.data);
      let cur_path=state.route.path.substring(1,state.route.path.length);
      let from_path=state.route.from.path.substring(1,state.route.from.path.length);

			if(cur_path!==message.data.object.id && message.data.object.id != "menu" && message.data.object.id != "notifications")
				router.replace("/"+message.data.object.id);

			if(from_path!=="")
			{
				if(from_path !== state.actors.active && from_path !="menu" && from_path !="notifications" ){
					if(from_path in state.data)
					{
            store.dispatch('sendUnSubscr', from_path);
						store.commit('dataDel',from_path);
					}
				}
			}
			if (message.data.object.id === state.actors.active) {
				store.dispatch('sendSubscr', "menu");
        store.dispatch('sendSubscr', "notifications");
			}

		},
		replyAction(state, message){

			if(message.data.action==="go_back")
			{
				router.go(-1);
			}
			if(message.data.action==="open_object")
			{
        let cur_path=state.route.path.substring(1,state.route.path.length);
        if(state.data[cur_path].object)
          if(state.data[cur_path].object.attributes)
            if(state.data[cur_path].object.attributes.temporary_object)
            {
              console.log("REPLACE!");
              router.replace("/"+message.data.action_data.object_id);
              return false;
            }
        router.push("/"+message.data.action_data.object_id);
			}
			if(message.data.action==="show_message")
			{
					console.log("WARNING!");
          router.beforeEach((to, from, next) => {
            next(false);
          });
					if(message.data.action_data.title) state.warning.title=message.data.action_data.title;
					if(message.data.action_data.message) state.warning.message=message.data.action_data.message;
					state.warning.stat=true;
			}
		},
    replyActionSubscribe(state, message){
			if(message.data.action==="open_object")
			{
        let from_path=state.route.from.path.substring(1,state.route.from.path.length);
        if(from_path!=="")
        {
          if(from_path !== state.actors.active && from_path !="menu" && from_path !="notifications" ){
            if(from_path in state.data)
            {
              store.dispatch('sendUnSubscr', from_path);
              store.commit('dataDel',from_path);
            }
          }
        }
				router.replace("/"+message.data.action_data.object_id);
			}
		},
		replyObjectList(state, message){
      let lobj=state.route.path.substring(1,state.route.path.length);
      if(lobj in state.data)
        if("list" in state.data[lobj])
        {
          if("objects" in state.data[lobj].list)
          {
            message.data.list.objects.forEach(item=>{state.data[lobj].list.objects.push(item);});
          }
          if("has_more" in state.data[lobj].list)
          state.data[lobj].list.has_more=message.data.list.has_more;
        }
      return true;
		},
		replyDiff(state, message){
			if(message.data.object_id in state.data)
			{
				if("object" in message.data)
				{
					if(message.data.object===null)
					{
						router.replace("/not_found");
						return true;
					}
      			state.data[message.data.object_id].object = Object.assign({},message.data.object);
				}
				if("list_changes" in message.data)
				{
          if("list" in state.data[message.data.object_id]){}
          else Vue.set(state.data[message.data.object_id],'list',{});

          if('objects' in state.data[message.data.object_id].list ){}
          else Vue.set(state.data[message.data.object_id].list,'objects',[]);

          let list=state.data[message.data.object_id].list.objects;
					let changes;
          let l;
					if("remove" in message.data.list_changes)
					{
						changes=message.data.list_changes.remove;
						changes.forEach(item =>{
								for(l=0;l<list.length;l++)
								{
									if(list[l].id===item){
                    list.splice(l,1);
                    break;
                  }
                }
						});
					}
					if("add" in message.data.list_changes)
					{
						changes=message.data.list_changes.add;

						changes.forEach(item =>{
							if("position" in item)
              {
								for(l=0;l<list.length;l++)
								{
									if(list[l].id===item.position) {
                    list.splice(l,0,item.object);
                    break;
                  }
								}
              }
								else list.splice(list.length,0,item.object);
						});
					}
					if("change" in message.data.list_changes)
					{
						changes=message.data.list_changes.change;
						changes.forEach(item =>{
								for(l=0;l<list.length;l++)
								{
									if(list[l].id===item.id){
                    list.splice(l,1,item);
                    break;
                  }
                }
						});
					}
				}
			}
		},
    SOCKET_ONMESSAGE(state, message1) {
      state.socket.message = message1;
      console.log("Message:\n" + JSON.stringify(message1));
			let message=JSON.parse(convStrip(JSON.stringify(message1)));

      if ("request_id" in message) {
        if (message.request_id === state.socket.wait.req) {
          if (message.type === "error") {
            store.commit('gotError', message);
            return true;
          }
					if (state.socket.wait.type === "actors") {
						store.commit('gotOk');
						store.commit('actorsFill', message.data.actors);
						return true;
					}

					if (state.socket.wait.type === "set_actor") {
            store.commit('actorsActiveSet', JSON.parse(state.socket.wait.message).data.actor_id);
            store.commit('gotOk');
            store.dispatch('sendSubscrWait', state.actors.active);
            return true;
          }

          if (message.type === "object_list") {
            store.commit('gotOk');
            store.commit('replyObjectList',message);
            return true;
          }

					if (state.socket.wait.type === "make_action" || state.socket.wait.type === "open_list_object" ) {
						store.commit('gotOk');
						if(message.type==='action')
						{
							store.commit('replyAction',message);
						}
						if (message.type === "actors") {
							store.commit('actorsFill', message.data.actors);
							return true;
						}
						if(message.type==='diff')
						{
							store.commit('replyDiff',message);
							return true;
						}

						return true;
					}

          if (state.socket.wait.type === "subscribe") {
            store.commit('gotOk');
            if(message.type==='action')
            {
              store.commit('replyActionSubscribe',message);
              return true;
            }
            if(message.type==='object')
            {
              store.commit('replyObject',message);
  						return true;
            }

					}

				}
			}
			if (message.type === "actors") {
				store.commit('gotOk');
				store.commit('actorsFill', message.data.actors);
				return true;
			}
			if(message.type==='diff')
			{
				store.commit('replyDiff',message);
				return true;
			}
      if (message.type === "object") {
        store.commit('replyObject',message);
        return true;
      }

      if(message.type==='action')
      {
        store.commit('replyAction',message);
        return true;
      }
		},
	},
  actions: {
    connectServ(context) {
      console.log("!!!!!");
      Vue.prototype.$disconnect();
      let client_id;
      if (localStorage.client_id) client_id = localStorage.client_id;
      else {
        client_id = uuid4();
        localStorage.client_id = client_id;
        console.log(client_id);
      }
      setTimeout(() => {
        Vue.prototype.$connect('ws://' + store.getters.socketGet.serverAddress + "/api/" + client_id, {
          store: store,
          format: 'json',
          reconnection: true
        });
      }, 1000);
    },
    sendGetActors(context) {
			let lsend = JSON.stringify({
				request_id: store.getters.socketGet.request_id.toString(),
				type: "get_actors",
				data: {}
			});
			store.dispatch('waitAnswer', {
				req: store.getters.socketGet.request_id.toString(),
				note: "Скачиваем список  пользователей...",
				error: "ОШИБКА! Нет ответа! Обратитесь к мастеру! <br>" + lsend,
				type: "actors",
				message: lsend
			});
			console.log("Sent: " + lsend);
			Vue.prototype.$socket.send(lsend);
			store.commit('sockReqIdIncr');
    },
    waitAnswer(context, lset) {
      store.commit('sockWaitSet', {
        req: lset.req,
        note: lset.note,
        error: false,
        type: lset.type,
        message: lset.message,
        id: setTimeout(() => {
          store.commit('sockWaitSet', {
            show: true,
            id: setTimeout(() => {
              store.commit('sockWaitSet', {
                error: lset.error
              });
            }, 5000)
          });
        }, 1000)
      });
    },
    sendSetActor(context, l_actor) {
      let lsend = JSON.stringify({
        request_id: store.getters.socketGet.request_id.toString(),
        type: "set_actor",
        data: {
          actor_id: l_actor
        }
      });
      store.dispatch('waitAnswer', {
        req: store.getters.socketGet.request_id.toString(),
        note: "Устанавлвиаем пользователя...",
        error: "ОШИБКА! Нет ответа! Обратитесь к мастеру! <br>" + lsend,
        type: "set_actor",
        message: lsend
      });
      console.log("Sent: " + lsend);
      Vue.prototype.$socket.send(lsend);
      store.commit('sockReqIdIncr');
    },
    sendSubscrWait(context, l_obj) {
      let lsend = JSON.stringify({
        request_id: store.getters.socketGet.request_id.toString(),
        type: "subscribe",
        data: {
          object_id: l_obj
        }
      });
      console.log("Sent: " + lsend);
      store.dispatch('waitAnswer', {
        req: store.getters.socketGet.request_id.toString(),
        note: "Подписка...",
        error: "ОШИБКА! Нет ответа! Обратитесь к мастеру! <br>" + lsend,
        type: "subscribe",
        message: lsend
      });
      Vue.prototype.$socket.send(lsend);
      store.commit('sockReqIdIncr');
    },
    sendAskMore(context, l_obj) {
      console.log("ASKED: " + l_obj);
      let lsend = JSON.stringify({
        request_id: store.getters.socketGet.request_id.toString(),
        type: "get_more",
        data: {
          object_id: l_obj
        }
      });
      console.log("Sent: " + lsend);
      store.dispatch('waitAnswer', {
        req: store.getters.socketGet.request_id.toString(),
        note: "Запрос продолжения списка...",
        error: "ОШИБКА! Нет ответа! Обратитесь к мастеру! <br>" + lsend,
        type: "object_list",
        message: lsend
      });
      Vue.prototype.$socket.send(lsend);
      store.commit('sockReqIdIncr');
    },
		sendOpenList(context, l_obj) {
			let lsend = JSON.stringify({
				request_id: store.getters.socketGet.request_id.toString(),
				type: "open_list_object",
				data: {
					object_id: l_obj.objid,
					list_object_id: l_obj.listid,
				}
			});
			console.log("Sent: " + lsend);
			store.dispatch('waitAnswer', {
				req: store.getters.socketGet.request_id.toString(),
				note: "Подписка на объект списка...",
				error: "ОШИБКА! Нет ответа! Обратитесь к мастеру! <br>" + lsend,
				type: "open_list_object",
				message: lsend
			});
			Vue.prototype.$socket.send(lsend);
			store.commit('sockReqIdIncr');
		},
    sendSubscr(context, l_obj) {
      let lsend = JSON.stringify({
        request_id: store.getters.socketGet.request_id.toString(),
        type: "subscribe",
        data: {
          object_id: l_obj
        }
      });
      console.log("Send: " + lsend);
      Vue.prototype.$socket.send(lsend);
      store.commit('sockReqIdIncr');
    },
		sendUnSubscr(context, l_obj) {
			let lsend = JSON.stringify({
				request_id: store.getters.socketGet.request_id.toString(),
				type: "unsubscribe",
				data: {
					object_id: l_obj
				}
			});
			console.log("Send: " + lsend);
			Vue.prototype.$socket.send(lsend);
			store.commit('sockReqIdIncr');
		},
    sendAct(store, payload) {
      let lact = payload.obj.actions[payload.actid];
      let lsend = {
        request_id: store.getters.socketGet.request_id.toString(),
        type: "make_action",
        data: {
          action_code: lact.code,
          params: lact.params
        }
      }
      if ("user_params" in lact) {
				lsend.data.user_params={};
        lact.user_params.forEach(
          litem => {
            lsend.data.user_params[litem.code] = litem.value;
          });
      }
  		let lsendS = JSON.stringify(lsend);

			store.dispatch('waitAnswer', {
				req: store.getters.socketGet.request_id.toString(),
				note: "Делаем действие...",
				error: "ОШИБКА! Нет ответа! Обратитесь к мастеру! <br>" + lsendS,
				type: "make_action",
				message: lsendS
			});
			console.log("Sent: " + lsendS);
			Vue.prototype.$socket.send(lsendS);
			store.commit('sockReqIdIncr');
    }
  },
  strict: process.env.NODE_ENV !== 'production'
});

store.commit('dataFill', JSON.parse(JSON.stringify(json1())));
store.commit('dataFill', JSON.parse(JSON.stringify(json2())));
store.commit('dataFill', JSON.parse(JSON.stringify(json3())));
store.commit('dataListFill', JSON.stringify(json2()));
