function json1() {
  return {
    "object": {
      "id": "babcom_web_0",
      "attributes": {
        "title": {
          "value": "Ваш статус",
          "hidden": false
        },
        "subtitle": {
          "value": "Тут вам дается возможность перераспределить ваши копеечки.",
          "hidden": false
        },
        "type": {
          "value": "income_distribution",
          "hidden": true
        },
        "health_level": {
          "value": "3",
          "name": "Тест!",
          "value_description": "Серебрянный статус - обслуживание в больницах на стандартном оборудовании.",
          "hidden": false
        },
        "living_level": {
          "value": "2",
          "value_description": "Бронзовый статус - можете находиться на станции.",
          "hidden": false
        },
        "fun_level": {
          "value": "5",
          "value_description": "Золотой статус - вам рады во всех развлекательных заведениях Паллады",
          "hidden": false
        },
        "police_level": {
          "value": "5",
          "value_description": "Бронзовый статус - вам не стоит рассчитывать на особое отношение сотрудников Star Helix",
          "hidden": false
        },
        "adm_level": {
          "value": "5",
          "value_description": "Бронзовый статус - ваши жалобы будет рассматривать автоматическая система судопроизводства",
          "hidden": false
        },
        "free_points": {
          "name": "Свободные деньги",
          "value": "300 UND",
          "hidden": false
        }
      },
      "actions": {
        "donate": {
          "code": "donate",
          "name": "Перераспределить",
          "disabled": false,
          "warning": "Мировое котоправительство следит за вами. Вы уверены?",
          "params": {},
          "user_params": [{
              "code": "message",
              "description": "Что вы думаете о котиках?",
              "type": "string",
              "restrictions": {
                "max_length": 300,
                "multiline": true,
                "min_length": 10,
              },
              "default_value": "Пусть этот скромный подарок послужит \nна благо всем нуждающимся"
            },
            {
              "code": "message2",
              "description": "~~Сообщение для фонда нищих и обездоленных~~",
              "type": "string",
              "restrictions": {
                "max_length": 300,
                "multiline": false,
                "min_length": 10,
              },
              "default_value": "Пусть этот скромный подарок послужит на благо всем нуждающимся"
            },
            {
              "code": "count",
              "description": "~~Количество отправляемых очков 444444444 444444444444 44444444444444 4444444444 44444~~",
              "type": "integer",
              "default_value": 5,
              "restrictions": {
                "min_value": 1,
                "max_value": 10
              }
            },
            {
              "code": "customs",
              "description": "~~Таможня~~",
              "type": "float",
              "restrictions": {
                "min_value": 1,
                "max_value": 10
              }
            }
          ]
        },
        "health_plus": {
          "code": "level_change",
          "name": "Плюс",
          "disabled": false,
          "params": {
            "level_type": "health",
            "change": "+"
          }
        },
        "health_minus": {
          "code": "level_change",
          "name": "Минус",
          "disabled": false,
          "warning": "На уровне ниже среднего помощь оказывается только в критических ситуациях. Вы действительно хотите понизить уровень медицинского обслуживания?",
          "params": {
            "level_type": "health",
            "change": "-"
          }
        },
        "social_plus": {
          "code": "level_change",
          "name": "Плюс",
          "disabled": false,
          "params": {
            "level_type": "social",
            "change": "+"
          }
        },
        "social_minus": {
          "code": "level_change",
          "name": "Мииииинус",
          "disabled": false,
          "warning": "На низком уровне ваши заявления не будут обрабатываться. Вы уверены?",
          "params": {
            "level_type": "social",
            "change": "-"
          }
        },
        "fun_plus": {
          "code": "level_change",
          "name": "Плююююююююююююс",
          "disabled": true
        },
        "fun_minus": {
          "code": "level_change",
          "name": "Миииииииииииииинус",
          "disabled": false,
          "params": {
            "level_type": "fun",
            "change": "-"
          }
        },
        "not_in_template1": {
          "code": "test",
          "name": "Button1",
          "disabled": false,
        },
        "not_in_template2": {
          "code": "test",
          "name": "Button2",
          "disabled": false,
        }
      },
      "template": {
        "title": "title",
        "subtitle": "subtitle",
        "groups": [
          {
            "name": "Административное обслуживание",
            "attributes": [
              "adm_level"
            ],
          },
          {
            "name": "Медицинское обслуживание",
            "attributes": [
              "health_level"
            ],
          },
          {
            "name": "Развлечения",
            "attributes": [
              "fun_level"
            ]
          },
          {
            "name": "Жизнеобеспечение",
            "attributes": [
              "living_level"
            ]
          },
          {
            "name": "Полиция",
            "attributes": [
              "police_level"
            ]
          },
          {
            "actions": [
              "donate"
            ]
          },
        ]
      }
    }
  }
}

function json2() {
  return {
    "object": {
      "id": "babcom_web_1",
      "attributes": {
        "title": {
          "value": "Новости",
          "hidden": false
        },
        "subtitle": {
          "value": "Сегодня на астероиде!",
          "hidden": false
        },
        "type": {
          "value": "transaction_list",
          "hidden": true
        }
      }
    },
    "list": {
      "objects": [{
          "id": "6137580d-67ac-46a6-9276-e2a26c8ce97a",
          "attributes": {
            "subtitle": {
              "name": "John Snow",
              "value": "Однажды, в студеную зимнюю пору я из лесу вышел, был сильный мороз.",
              "hidden": false
            },
            "title": {
              "value": "Случай в лесу",
              "hidden": false
            }
          },
          "actions":{
            "plus": {
              "code": "level_change",
              "name": "Like it!",
              "disabled": false,
              "params": {}
            }
          },
          "template": {
            "groups": [{
                "actions": [
                  "plus"
                ]
              }]
          }
        },
        {
            "id": "6137580d-67ac-46a6-9276-e2a26c8ce97b",
            "attributes": {
              "subtitle": {
                "name": "",
                "value": "Знайка шел гулять на речку, перепрыгнул через овечку.",
                "hidden": false
              },
              "title": {
                "value": "Купание с овцой",
                "hidden": false
              }
            },
            "actions":{
              "plus": {
                "code": "level_change",
                "name": "Like it!",
                "disabled": false,
                "params": {}
              }
            },
            "template": {
              "groups": [{
                  "actions": [
                    "plus"
                  ]
                }]
            }
        }
      ]
    }
  }
};

function json3() {
  return {
    "object": {
     "id": "babcom_web_2",
     "actions": {
       "chat_mute": {
         "code": "chat_mute",
         "name": "Включить уведомления",
         "params": {
           "chat_code": "9f6c97b9-9ad1-49b7-acab-33e09a5ae2c1",
           "mute_on_off": "off"
         },
         "disabled": false
       },
       "chat_leave": {
         "code": "chat_leave",
         "name": "Выйти из чата",
         "params": {
           "chat_code": "9f6c97b9-9ad1-49b7-acab-33e09a5ae2c1"
         },
         "warning": "Вы уверены? Этот чат исчезнет из вашего списка чатов, и вернуться вы не сможете.",
         "disabled": false
       },
       "chat_write": {
         "code": "chat_write",
         "name": "Написать",
         "params": {
           "chat_code": "9f6c97b9-9ad1-49b7-acab-33e09a5ae2c1"
         },
         "disabled": false,
         "user_params": [
           {
             "code": "message_text",
             "type": "string",
             "description": "Введите текст сообщения",
             "restrictions": {
               "multiline": true
             }
           }
         ]
       },
       "chat_add_person": {
         "code": "chat_add_person",
         "name": "Добавить/посмотреть участников",
         "params": {
           "chat_code": "9f6c97b9-9ad1-49b7-acab-33e09a5ae2c1"
         },
         "disabled": false
       }
     },
     "template": {
       "groups": [
         {
           "actions": [
             "chat_add_person",
             "chat_leave",
             "chat_mute"
           ],
           "attributes": [
             "chat_is_mute"
           ]
         },
         {
           "actions": [
             "chat_write"
           ]
         }
       ]
     },
     "attributes": {
       "type": {
         "value": "chat"
       },
       "title": {
         "value": "Чат: Джерри Адамс"
       },
       "chat_is_mute": {
         "value": true,
         "value_description": "Уведомления отключены"
       }
     }
   }
  }
};

//	menu:{key:0, obj:{
    // "id": 0,
    // "attributes": {
    //   "title": {
    //     "value": "**Распределение дохода**",
    //     "hidden": false
    //   },
    //   "subtitle": {
    //     "value": "~~Тут вам дается возможность перераспределить ваши Коины.~~",
    //     "hidden": false
    //   },
    //   "inmenu": {
    //     "value": "Очень важная информация без которой никак",
    //     "hidden": false
    //   }
    // },
    // "actions": {
    //   "donate": {
    //     "code": "donate",
    //     "name": "~~Потратить на благотворительность~~",
    //     "disabled": false,
    //     "warning": "После ~~выполнения~~ действия очки дохода нельзя будет вернуть. Вы уверены?",
    //     "params": {},
    //     "user_params": [{
    //         "code": "message",
    //         "description": "Сообщение для фонда нищих и обездоленных",
    //         "type": "string",
    //         "restrictions": {
    //           "max_length": 300,
    //           "multiline": true,
    //           "min_length": 10,
    //         },
    //         "default_value": "Пусть этот скромный подарок послужит \nна благо всем нуждающимся"
    //       },
    //       {
    //         "code": "message2",
    //         "description": "~~Сообщение для фонда нищих и обездоленных~~",
    //         "type": "string",
    //         "restrictions": {
    //           "max_length": 300,
    //           "multiline": false,
    //           "min_length": 10,
    //         },
    //         "default_value": "Пусть этот скромный подарок послужит на благо всем нуждающимся"
    //       },
    //       {
    //         "code": "count",
    //         "description": "~~Количество отправляемых очков 444444444 444444444444 44444444444444 4444444444 44444~~",
    //         "type": "integer",
    //         "default_value": 5,
    //         "restrictions": {
    //           "min_value": 1,
    //           "max_value": 10
    //         }
    //       },
    //       {
    //         "code": "customs",
    //         "description": "~~Таможня~~",
    //         "type": "float",
    //         "restrictions": {
    //           "min_value": 1,
    //           "max_value": 10
    //         }
    //       }
    //     ]
    //   },
    //   "health_plus": {
    //     "code": "level_change",
    //     "name": "Плюс",
    //     "disabled": false,
    //     "params": {
    //       "level_type": "health",
    //       "change": "+"
    //     }
    //   },
    //   "health_minus": {
    //     "code": "level_change",
    //     "name": "Минус",
    //     "disabled": false,
    //     "warning": "На уровне ниже среднего помощь оказывается только в критических ситуациях. Вы действительно хотите понизить уровень медицинского обслуживания?",
    //     "params": {
    //       "level_type": "health",
    //       "change": "-"
    //     }
    //   }
    // },
    // "template": {
    //   "groups": [{
    //       "name": "Типа меню",
    //       "attributes": [
    //         "inmenu"
    //       ],
    //       "actions": [
    //         "donate","health_plus","health_minus"
    //       ]
    //     },
    //     {
    //       "name": "Здоровье",
    //       "attributes": [
    //         "inmenu"
    //       ],
    //       "actions": [
    //         "health_plus",
    //         "health_minus"
    //       ]
    //     }
    //   ]
    // }
//    }},
export {
  json1,
  json2,
  json3
}
