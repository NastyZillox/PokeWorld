import { useState, useEffect, useRef, useCallback } from "react";
import { DS_THEME as C, DS_PAGE_BG } from "./theme";

// ═══════════════════════════════════════════════════════════════════
//  MOVES DATABASE — puissance, catégorie, effet statut
// ═══════════════════════════════════════════════════════════════════
const MOVES_DB = {
  "Charge":{pow:40,cat:"phy"},"Morsure":{pow:60,cat:"phy"},"Griffe":{pow:40,cat:"phy"},
  "Tranche":{pow:70,cat:"phy"},"Vive-Attaque":{pow:40,cat:"phy"},"Jackpot":{pow:40,cat:"phy"},
  "Coup d'Aile":{pow:60,cat:"phy"},"Tornade":{pow:55,cat:"spe"},"Poing Karaté":{pow:75,cat:"phy"},
  "Judo":{pow:80,cat:"phy"},"Coup d'Os":{pow:65,cat:"phy"},"Coup Lame":{pow:70,cat:"phy"},
  "Éboulement":{pow:75,cat:"phy"},"Jet-Pierres":{pow:50,cat:"phy"},"Séisme":{pow:100,cat:"phy"},
  "Fracass'Roc":{pow:80,cat:"phy"},"Surf":{pow:90,cat:"spe"},"Cascade":{pow:80,cat:"phy"},
  "Aqua-Queue":{pow:90,cat:"phy"},"Pistolet à O":{pow:40,cat:"spe"},"Blizzard":{pow:110,cat:"spe"},
  "Flammèche":{pow:40,cat:"spe"},"Lance-Flammes":{pow:90,cat:"spe"},"Déflagration":{pow:110,cat:"spe"},
  "Tir de Feu":{pow:130,cat:"spe"},"Tonnerre":{pow:90,cat:"spe"},"Orage":{pow:110,cat:"spe"},
  "Voltacle":{pow:140,cat:"spe"},"Psyko":{pow:90,cat:"spe"},"Hyper Faisceau":{pow:150,cat:"spe"},
  "Vol":{pow:90,cat:"phy"},"Atterrissage":{pow:70,cat:"phy"},"Tranche-Ombre":{pow:70,cat:"phy"},
  "Poing Ombre":{pow:60,cat:"phy"},"Macabre":{pow:60,cat:"phy"},"Dard-Venin":{pow:15,cat:"phy"},
  "Acide":{pow:40,cat:"spe"},"Léchouille":{pow:20,cat:"phy"},"Ombre":{pow:40,cat:"phy"},
  "Draco-Météore":{pow:130,cat:"spe"},"Lance-Soleil":{pow:120,cat:"spe"},
  "Tonnerre Sacré":{pow:100,cat:"spe"},"Géo-Contrôle":{pow:100,cat:"spe"},
  "Fouet Lianes":{pow:45,cat:"phy"},"Tranch'Herbe":{pow:55,cat:"phy"},
  "Feuille Rasoir":{pow:55,cat:"phy"},"Lame-Feuille":{pow:90,cat:"phy"},
  "Giga-Sangsue":{pow:75,cat:"spe"},"Aurasphère":{pow:80,cat:"spe"},
  "Lance Métal":{pow:70,cat:"phy"},"Queue de Fer":{pow:100,cat:"phy"},
  "Ultrasons":{pow:55,cat:"spe"},"Aéroblast":{pow:100,cat:"spe"},
  "Nuit Noire":{pow:85,cat:"phy"},"Gros Câlin":{pow:90,cat:"phy"},
  "Boue-Bombe":{pow:65,cat:"spe"},"Trempette":{pow:40,cat:"phy"},
  "Éclat Magique":{pow:80,cat:"spe"},"Vent Fabuleux":{pow:90,cat:"spe"},
  "Rayon Ombral":{pow:80,cat:"spe"},"Mort-Vie":{pow:120,cat:"spe"},
  "Châtiment":{pow:80,cat:"phy"},"Bloquebise":{pow:65,cat:"spe"},
  "Doux Parfum":{pow:40,cat:"spe"},"Picpic":{pow:35,cat:"phy"},"Absosorbe":{pow:75,cat:"spe"},
  // Statuts — pow:0, pas de dégâts directs
  "Rugissement":{pow:0,cat:"sta",eff:"def-1"},"Berceuse":{pow:0,cat:"sta",eff:"sleep"},
  "Chant":{pow:0,cat:"sta",eff:"sleep"},"Téléport":{pow:0,cat:"sta",eff:"flee"},
  "Amnésie":{pow:0,cat:"sta",eff:"spa+2"},"Repos":{pow:0,cat:"sta",eff:"heal"},
  "Poudre Dodo":{pow:0,cat:"sta",eff:"sleep"},"Vœu Soin":{pow:0,cat:"sta",eff:"heal"},
  "Défense":{pow:0,cat:"sta",eff:"def+1"},"Éblouissement":{pow:0,cat:"sta",eff:"acc-1"},
  "Métamorph":{pow:0,cat:"sta",eff:"copy"},"Bouclier":{pow:0,cat:"sta",eff:"def+2"},
};

// ═══════════════════════════════════════════════════════════════════
//  POKÉMON DB — Gen I à VI (200+ espèces)
// ═══════════════════════════════════════════════════════════════════
const PKM = [
  {id:1,n:"Bulbizarre",t:["Plante","Poison"],hp:45,atk:49,def:49,mv:["Tranch'Herbe","Poudre Dodo","Rugissement","Charge"],evoAt:16,evoTo:2},
  {id:2,n:"Herbizarre",t:["Plante","Poison"],hp:60,atk:62,def:63,mv:["Tranch'Herbe","Tranche","Lance-Soleil","Fouet Lianes"],evoAt:32,evoTo:3},
  {id:3,n:"Florizarre",t:["Plante","Poison"],hp:80,atk:82,def:83,mv:["Lance-Soleil","Tranch'Herbe","Tranche","Tonnerre Sacré"]},
  {id:4,n:"Salamèche",t:["Feu"],hp:39,atk:52,def:43,mv:["Flammèche","Griffe","Rugissement","Charge"],evoAt:16,evoTo:5},
  {id:5,n:"Reptincel",t:["Feu"],hp:58,atk:64,def:58,mv:["Lance-Flammes","Griffe","Tranche","Flammèche"],evoAt:36,evoTo:6},
  {id:6,n:"Dracaufeu",t:["Feu","Vol"],hp:78,atk:84,def:78,mv:["Lance-Flammes","Tranche","Séisme","Vol"]},
  {id:7,n:"Carapuce",t:["Eau"],hp:44,atk:48,def:65,mv:["Pistolet à O","Tranche","Rugissement","Charge"],evoAt:16,evoTo:8},
  {id:8,n:"Carabaffe",t:["Eau"],hp:59,atk:63,def:80,mv:["Surf","Morsure","Pistolet à O","Tranche"],evoAt:36,evoTo:9},
  {id:9,n:"Tortank",t:["Eau"],hp:79,atk:83,def:100,mv:["Surf","Cascade","Morsure","Séisme"]},
  {id:16,n:"Roucool",t:["Normal","Vol"],hp:40,atk:45,def:40,mv:["Tornade","Coup d'Aile","Rugissement","Vive-Attaque"],evoAt:18,evoTo:17},
  {id:17,n:"Roucoups",t:["Normal","Vol"],hp:63,atk:60,def:55,mv:["Tornade","Coup d'Aile","Tranche","Vive-Attaque"],evoAt:36,evoTo:18},
  {id:18,n:"Roucarnage",t:["Normal","Vol"],hp:83,atk:80,def:75,mv:["Tornade","Coup d'Aile","Tranche","Vive-Attaque"]},
  {id:19,n:"Rattata",t:["Normal"],hp:30,atk:56,def:35,mv:["Morsure","Vive-Attaque","Rugissement","Jackpot"],evoAt:20,evoTo:20},
  {id:20,n:"Rattatac",t:["Normal"],hp:55,atk:81,def:60,mv:["Morsure","Vive-Attaque","Tranche","Jackpot"]},
  {id:25,n:"Pikachu",t:["Électrik"],hp:35,atk:55,def:40,mv:["Tonnerre","Vive-Attaque","Griffe","Rugissement"]},
  {id:26,n:"Raichu",t:["Électrik"],hp:60,atk:90,def:55,mv:["Tonnerre","Vive-Attaque","Queue de Fer","Tranche"]},
  {id:35,n:"Mélofée",t:["Normal","Fée"],hp:70,atk:45,def:48,mv:["Gros Câlin","Charge","Rugissement","Éclat Magique"]},
  {id:37,n:"Goupix",t:["Feu"],hp:38,atk:41,def:40,mv:["Flammèche","Rugissement","Vive-Attaque","Griffe"]},
  {id:38,n:"Feunard",t:["Feu"],hp:73,atk:76,def:75,mv:["Lance-Flammes","Tranche","Vive-Attaque","Rugissement"]},
  {id:39,n:"Rondoudou",t:["Normal","Fée"],hp:115,atk:45,def:20,mv:["Gros Câlin","Chant","Charge","Éclat Magique"]},
  {id:41,n:"Nosferapti",t:["Poison","Vol"],hp:40,atk:45,def:35,mv:["Ultrasons","Morsure","Rugissement","Léchouille"],evoAt:22,evoTo:42},
  {id:42,n:"Nosferalto",t:["Poison","Vol"],hp:75,atk:80,def:70,mv:["Ultrasons","Morsure","Tranche","Atterrissage"]},
  {id:43,n:"Mystherbe",t:["Plante","Poison"],hp:45,atk:50,def:55,mv:["Tranch'Herbe","Rugissement","Poudre Dodo","Acide"],evoAt:21,evoTo:44},
  {id:44,n:"Ortide",t:["Plante","Poison"],hp:75,atk:80,def:85,mv:["Tranch'Herbe","Acide","Tranche","Doux Parfum"]},
  {id:50,n:"Taupiqueur",t:["Sol"],hp:10,atk:55,def:25,mv:["Griffe","Rugissement","Séisme","Jackpot"],evoAt:26,evoTo:51},
  {id:52,n:"Miaouss",t:["Normal"],hp:40,atk:45,def:35,mv:["Griffe","Rugissement","Jackpot","Tranche"],evoAt:28,evoTo:53},
  {id:53,n:"Persian",t:["Normal"],hp:65,atk:70,def:60,mv:["Griffe","Jackpot","Tranche","Rugissement"]},
  {id:54,n:"Psykokwak",t:["Eau"],hp:50,atk:52,def:48,mv:["Pistolet à O","Psyko","Rugissement","Charge"],evoAt:33,evoTo:55},
  {id:55,n:"Akwakwak",t:["Eau"],hp:80,atk:82,def:78,mv:["Surf","Psyko","Tranche","Cascade"]},
  {id:58,n:"Caninos",t:["Feu"],hp:55,atk:70,def:45,mv:["Flammèche","Rugissement","Griffe","Morsure"]},
  {id:60,n:"Têtarte",t:["Eau"],hp:40,atk:40,def:40,mv:["Pistolet à O","Rugissement","Charge","Léchouille"],evoAt:25,evoTo:61},
  {id:63,n:"Abra",t:["Psy"],hp:25,atk:20,def:15,mv:["Psyko","Téléport","Rugissement","Orage"],evoAt:16,evoTo:64},
  {id:64,n:"Kadabra",t:["Psy"],hp:40,atk:35,def:30,mv:["Psyko","Téléport","Tranche","Orage"]},
  {id:66,n:"Machoc",t:["Combat"],hp:70,atk:80,def:50,mv:["Poing Karaté","Judo","Rugissement","Charge"],evoAt:28,evoTo:67},
  {id:69,n:"Chétiflor",t:["Plante","Poison"],hp:50,atk:75,def:35,mv:["Tranche","Rugissement","Charge","Poudre Dodo"],evoAt:21,evoTo:70},
  {id:74,n:"Racaillou",t:["Roche","Sol"],hp:40,atk:80,def:100,mv:["Éboulement","Jet-Pierres","Défense","Séisme"],evoAt:25,evoTo:75},
  {id:75,n:"Gravalanch",t:["Roche","Sol"],hp:55,atk:95,def:115,mv:["Éboulement","Séisme","Défense","Jet-Pierres"],evoAt:36,evoTo:76},
  {id:79,n:"Ramoloss",t:["Eau","Psy"],hp:95,atk:75,def:110,mv:["Surf","Psyko","Rugissement","Amnésie"]},
  {id:92,n:"Fantominus",t:["Spectre","Poison"],hp:30,atk:35,def:30,mv:["Macabre","Ombre","Rugissement","Léchouille"],evoAt:25,evoTo:93},
  {id:93,n:"Spectrum",t:["Spectre","Poison"],hp:45,atk:50,def:45,mv:["Macabre","Ombre","Tranche-Ombre","Léchouille"]},
  {id:94,n:"Ectoplasma",t:["Spectre","Poison"],hp:60,atk:65,def:60,mv:["Tranche-Ombre","Macabre","Psyko","Poing Ombre"]},
  {id:104,n:"Osselait",t:["Sol"],hp:50,atk:50,def:95,mv:["Coup d'Os","Séisme","Rugissement","Défense"],evoAt:28,evoTo:105},
  {id:109,n:"Smogo",t:["Poison"],hp:40,atk:65,def:95,mv:["Dard-Venin","Rugissement","Charge","Acide"],evoAt:35,evoTo:110},
  {id:113,n:"Leveinard",t:["Normal"],hp:250,atk:5,def:5,mv:["Vœu Soin","Gros Câlin","Tranche","Charge"]},
  {id:123,n:"Insécateur",t:["Insecte","Vol"],hp:70,atk:110,def:80,mv:["Coup Lame","Vol","Tranche","Vive-Attaque"]},
  {id:129,n:"Magikarpe",t:["Eau"],hp:20,atk:10,def:55,mv:["Trempette","Rugissement","Charge","Vive-Attaque"],evoAt:20,evoTo:130},
  {id:130,n:"Léviator",t:["Eau","Vol"],hp:95,atk:125,def:79,mv:["Surf","Cascade","Hyper Faisceau","Séisme"]},
  {id:131,n:"Lokhlass",t:["Eau","Glace"],hp:130,atk:85,def:80,mv:["Surf","Blizzard","Gros Câlin","Cascade"]},
  {id:133,n:"Évoli",t:["Normal"],hp:55,atk:55,def:50,mv:["Morsure","Vive-Attaque","Rugissement","Charge"]},
  {id:143,n:"Ronflex",t:["Normal"],hp:160,atk:110,def:65,mv:["Gros Câlin","Séisme","Tranche","Repos"]},
  {id:144,n:"Artikodin",t:["Glace","Vol"],hp:90,atk:85,def:100,mv:["Blizzard","Vent Arrière","Vive-Attaque","Bloquebise"],leg:true},
  {id:145,n:"Électhor",t:["Électrik","Vol"],hp:90,atk:90,def:85,mv:["Tonnerre","Atterrissage","Vive-Attaque","Éblouissement"],leg:true},
  {id:146,n:"Sulfura",t:["Feu","Vol"],hp:90,atk:100,def:90,mv:["Lance-Flammes","Déflagration","Atterrissage","Vive-Attaque"],leg:true},
  {id:147,n:"Minidraco",t:["Dragon"],hp:41,atk:64,def:45,mv:["Draco-Météore","Morsure","Vive-Attaque","Rugissement"],evoAt:30,evoTo:148},
  {id:148,n:"Draco",t:["Dragon"],hp:61,atk:84,def:65,mv:["Draco-Météore","Tranche","Vive-Attaque","Rugissement"],evoAt:55,evoTo:149},
  {id:149,n:"Dracolosse",t:["Dragon","Vol"],hp:91,atk:134,def:95,mv:["Draco-Météore","Tranche","Tonnerre","Vol"]},
  {id:150,n:"Mewtwo",t:["Psy"],hp:106,atk:110,def:90,mv:["Psyko","Amnésie","Tranche","Hyper Faisceau"],leg:true},
  {id:151,n:"Mew",t:["Psy"],hp:100,atk:100,def:100,mv:["Psyko","Gros Câlin","Tranche","Orage"],leg:true},
  // ── GEN II — JOHTO ────────────────────────────────────────────
  {id:152,n:"Germignon",t:["Plante"],hp:45,atk:49,def:65,mv:["Tranch'Herbe","Giga-Sangsue","Rugissement","Charge"],evoAt:16,evoTo:153},
  {id:153,n:"Macronium",t:["Plante"],hp:60,atk:62,def:80,mv:["Tranch'Herbe","Giga-Sangsue","Lame-Feuille","Rugissement"],evoAt:32,evoTo:154},
  {id:154,n:"Méganium",t:["Plante"],hp:80,atk:82,def:100,mv:["Lance-Soleil","Lame-Feuille","Tonnerre Sacré","Giga-Sangsue"]},
  {id:155,n:"Héricendre",t:["Feu"],hp:45,atk:58,def:64,mv:["Flammèche","Griffe","Rugissement","Charge"],evoAt:14,evoTo:156},
  {id:156,n:"Feurisson",t:["Feu"],hp:60,atk:73,def:79,mv:["Lance-Flammes","Griffe","Tranche","Rugissement"],evoAt:36,evoTo:157},
  {id:157,n:"Typhlosion",t:["Feu"],hp:78,atk:84,def:78,mv:["Déflagration","Lance-Flammes","Tranche","Séisme"]},
  {id:158,n:"Kaiminus",t:["Eau"],hp:50,atk:65,def:64,mv:["Pistolet à O","Morsure","Rugissement","Charge"],evoAt:18,evoTo:159},
  {id:159,n:"Crocrodil",t:["Eau"],hp:65,atk:80,def:80,mv:["Surf","Morsure","Tranche","Pistolet à O"],evoAt:30,evoTo:160},
  {id:160,n:"Aligatueur",t:["Eau"],hp:85,atk:105,def:100,mv:["Surf","Morsure","Séisme","Hyper Faisceau"]},
  {id:161,n:"Fouinette",t:["Normal"],hp:35,atk:46,def:34,mv:["Morsure","Vive-Attaque","Rugissement","Jackpot"],evoAt:15,evoTo:162},
  {id:162,n:"Fouinar",t:["Normal"],hp:55,atk:76,def:64,mv:["Morsure","Vive-Attaque","Tranche","Jackpot"]},
  {id:163,n:"Hoothoot",t:["Normal","Vol"],hp:60,atk:30,def:30,mv:["Rugissement","Atterrissage","Charge","Tornade"],evoAt:20,evoTo:164},
  {id:164,n:"Noarfang",t:["Normal","Vol"],hp:100,atk:50,def:50,mv:["Atterrissage","Tornade","Tranche","Vol"]},
  {id:172,n:"Pichu",t:["Électrik"],hp:20,atk:40,def:15,mv:["Tonnerre","Rugissement","Charge","Vive-Attaque"]},
  {id:175,n:"Togepi",t:["Fée"],hp:35,atk:20,def:65,mv:["Vœu Soin","Rugissement","Charge","Éclat Magique"]},
  {id:176,n:"Togetic",t:["Fée","Vol"],hp:55,atk:40,def:85,mv:["Vœu Soin","Atterrissage","Éclat Magique","Vol"]},
  {id:179,n:"Wattouat",t:["Électrik"],hp:55,atk:40,def:40,mv:["Tonnerre","Charge","Rugissement","Orage"],evoAt:15,evoTo:180},
  {id:180,n:"Lainergie",t:["Électrik"],hp:70,atk:55,def:55,mv:["Tonnerre","Orage","Tranche","Rugissement"],evoAt:30,evoTo:181},
  {id:181,n:"Pharamp",t:["Électrik"],hp:90,atk:75,def:85,mv:["Tonnerre","Orage","Tranche","Hyper Faisceau"]},
  {id:183,n:"Marill",t:["Eau","Fée"],hp:70,atk:20,def:50,mv:["Pistolet à O","Gros Câlin","Rugissement","Charge"],evoAt:18,evoTo:184},
  {id:184,n:"Azumarill",t:["Eau","Fée"],hp:100,atk:50,def:80,mv:["Surf","Gros Câlin","Aqua-Queue","Éclat Magique"]},
  {id:196,n:"Mentali",t:["Psy"],hp:65,atk:65,def:60,mv:["Psyko","Tranche","Amnésie","Rugissement"]},
  {id:197,n:"Noctali",t:["Ténèbres"],hp:95,atk:65,def:110,mv:["Morsure","Tranche","Nuit Noire","Rugissement"]},
  {id:200,n:"Feuforêve",t:["Spectre"],hp:60,atk:60,def:60,mv:["Tranche-Ombre","Macabre","Poing Ombre","Rugissement"]},
  {id:207,n:"Scorplane",t:["Sol","Vol"],hp:40,atk:55,def:50,mv:["Dard-Venin","Vive-Attaque","Rugissement","Tranche"]},
  {id:208,n:"Steelix",t:["Acier","Sol"],hp:75,atk:85,def:200,mv:["Séisme","Lance Métal","Fracass'Roc","Rugissement"]},
  {id:210,n:"Granbull",t:["Fée"],hp:90,atk:120,def:75,mv:["Morsure","Tranche","Séisme","Hyper Faisceau"]},
  {id:212,n:"Cizayox",t:["Insecte","Acier"],hp:70,atk:130,def:100,mv:["Coup Lame","Lance Métal","Tranche","Vive-Attaque"]},
  {id:214,n:"Scarhino",t:["Insecte","Combat"],hp:80,atk:125,def:75,mv:["Poing Karaté","Coup Lame","Séisme","Tranche"]},
  {id:215,n:"Farfuret",t:["Ténèbres","Glace"],hp:55,atk:95,def:55,mv:["Morsure","Tranche","Vive-Attaque","Nuit Noire"]},
  {id:216,n:"Teddiursa",t:["Normal"],hp:60,atk:80,def:50,mv:["Griffe","Charge","Rugissement","Morsure"],evoAt:30,evoTo:217},
  {id:217,n:"Ursaring",t:["Normal"],hp:90,atk:130,def:75,mv:["Griffe","Tranche","Séisme","Hyper Faisceau"]},
  {id:227,n:"Airmure",t:["Acier","Vol"],hp:65,atk:80,def:140,mv:["Vol","Lance Métal","Atterrissage","Tranche"]},
  {id:228,n:"Malosse",t:["Ténèbres","Feu"],hp:45,atk:60,def:30,mv:["Morsure","Flammèche","Rugissement","Charge"],evoAt:24,evoTo:229},
  {id:229,n:"Démolosse",t:["Ténèbres","Feu"],hp:75,atk:90,def:50,mv:["Morsure","Lance-Flammes","Nuit Noire","Tranche"]},
  {id:231,n:"Phanpy",t:["Sol"],hp:90,atk:60,def:60,mv:["Charge","Séisme","Rugissement","Coup d'Os"],evoAt:25,evoTo:232},
  {id:232,n:"Donphan",t:["Sol"],hp:90,atk:120,def:120,mv:["Séisme","Fracass'Roc","Charge","Hyper Faisceau"]},
  {id:237,n:"Kapoera",t:["Combat"],hp:50,atk:120,def:53,mv:["Poing Karaté","Judo","Vive-Attaque","Séisme"]},
  {id:242,n:"Leuphorie",t:["Normal"],hp:255,atk:10,def:10,mv:["Vœu Soin","Gros Câlin","Tranche","Rugissement"]},
  {id:243,n:"Raikou",t:["Électrik"],hp:90,atk:85,def:75,mv:["Tonnerre","Vive-Attaque","Tranche","Orage"],leg:true},
  {id:244,n:"Entei",t:["Feu"],hp:115,atk:115,def:85,mv:["Lance-Flammes","Déflagration","Tranche","Vive-Attaque"],leg:true},
  {id:245,n:"Suicune",t:["Eau"],hp:100,atk:75,def:115,mv:["Surf","Blizzard","Aqua-Queue","Tranche"],leg:true},
  {id:246,n:"Embrylex",t:["Roche","Sol"],hp:50,atk:64,def:50,mv:["Morsure","Jet-Pierres","Rugissement","Charge"],evoAt:30,evoTo:247},
  {id:247,n:"Ymphect",t:["Roche","Sol"],hp:70,atk:84,def:70,mv:["Jet-Pierres","Morsure","Séisme","Tranche"],evoAt:55,evoTo:248},
  {id:248,n:"Tyranocif",t:["Roche","Ténèbres"],hp:100,atk:134,def:110,mv:["Fracass'Roc","Morsure","Séisme","Hyper Faisceau"]},
  {id:249,n:"Lugia",t:["Psy","Vol"],hp:106,atk:90,def:130,mv:["Aéroblast","Psyko","Surf","Vent Fabuleux"],leg:true},
  {id:250,n:"Ho-Oh",t:["Feu","Vol"],hp:106,atk:130,def:90,mv:["Tonnerre Sacré","Déflagration","Lance-Soleil","Vol"],leg:true},
  {id:251,n:"Celebi",t:["Psy","Plante"],hp:100,atk:100,def:100,mv:["Psyko","Lance-Soleil","Giga-Sangsue","Orage"],leg:true},
  // ── GEN III — HOENN ───────────────────────────────────────────
  {id:252,n:"Arcko",t:["Plante"],hp:45,atk:65,def:45,mv:["Fouet Lianes","Jackpot","Morsure","Rugissement"],evoAt:16,evoTo:253},
  {id:253,n:"Massko",t:["Plante"],hp:50,atk:65,def:45,mv:["Fouet Lianes","Lame-Feuille","Tranche","Rugissement"],evoAt:36,evoTo:254},
  {id:254,n:"Jungko",t:["Plante"],hp:70,atk:85,def:65,mv:["Lance-Soleil","Lame-Feuille","Tranche","Séisme"]},
  {id:255,n:"Poussifeu",t:["Feu"],hp:45,atk:60,def:40,mv:["Flammèche","Griffe","Rugissement","Charge"],evoAt:16,evoTo:256},
  {id:256,n:"Galifeu",t:["Feu","Combat"],hp:60,atk:85,def:60,mv:["Lance-Flammes","Poing Karaté","Tranche","Rugissement"],evoAt:36,evoTo:257},
  {id:257,n:"Braségali",t:["Feu","Combat"],hp:80,atk:120,def:70,mv:["Déflagration","Poing Karaté","Tranche","Séisme"]},
  {id:258,n:"Gobou",t:["Eau"],hp:50,atk:70,def:70,mv:["Boue-Bombe","Pistolet à O","Morsure","Charge"],evoAt:16,evoTo:259},
  {id:259,n:"Flobio",t:["Eau","Sol"],hp:70,atk:85,def:80,mv:["Surf","Boue-Bombe","Tranche","Séisme"],evoAt:36,evoTo:260},
  {id:260,n:"Laggron",t:["Eau","Sol"],hp:100,atk:110,def:90,mv:["Surf","Séisme","Boue-Bombe","Hyper Faisceau"]},
  {id:261,n:"Zigzaton",t:["Normal"],hp:38,atk:30,def:41,mv:["Morsure","Vive-Attaque","Rugissement","Jackpot"],evoAt:20,evoTo:262},
  {id:262,n:"Mangriff",t:["Normal"],hp:58,atk:60,def:61,mv:["Morsure","Vive-Attaque","Tranche","Jackpot"]},
  {id:270,n:"Nénupiot",t:["Eau","Plante"],hp:40,atk:40,def:50,mv:["Pistolet à O","Giga-Sangsue","Rugissement","Charge"],evoAt:14,evoTo:271},
  {id:271,n:"Lombre",t:["Eau","Plante"],hp:60,atk:50,def:70,mv:["Surf","Giga-Sangsue","Tranche","Rugissement"]},
  {id:272,n:"Ludicolo",t:["Eau","Plante"],hp:80,atk:70,def:70,mv:["Surf","Lance-Soleil","Giga-Sangsue","Tranche"]},
  {id:276,n:"Nirondelle",t:["Normal","Vol"],hp:40,atk:55,def:30,mv:["Coup d'Aile","Rugissement","Vive-Attaque","Tornade"],evoAt:22,evoTo:277},
  {id:277,n:"Hélédelle",t:["Normal","Vol"],hp:80,atk:80,def:80,mv:["Charge","Tranche","Séisme","Vive-Attaque"]},
  {id:278,n:"Goélise",t:["Eau","Vol"],hp:40,atk:30,def:30,mv:["Pistolet à O","Vent Fabuleux","Rugissement","Tornade"],evoAt:25,evoTo:279},
  {id:279,n:"Bekipan",t:["Eau","Vol"],hp:60,atk:50,def:100,mv:["Surf","Vent Fabuleux","Vol","Tranche"]},
  {id:280,n:"Tarsal",t:["Psy","Fée"],hp:28,atk:25,def:25,mv:["Vœu Soin","Rugissement","Psyko","Éclat Magique"],evoAt:20,evoTo:281},
  {id:281,n:"Kirlia",t:["Psy","Fée"],hp:38,atk:35,def:35,mv:["Psyko","Éclat Magique","Tranche","Rugissement"],evoAt:30,evoTo:282},
  {id:282,n:"Gardevoir",t:["Psy","Fée"],hp:68,atk:65,def:65,mv:["Psyko","Éclat Magique","Tonnerre Sacré","Hyper Faisceau"]},
  {id:302,n:"Ténéfix",t:["Ténèbres"],hp:45,atk:75,def:75,mv:["Morsure","Tranche","Rugissement","Jackpot"]},
  {id:318,n:"Carvanha",t:["Eau","Ténèbres"],hp:45,atk:90,def:20,mv:["Morsure","Surf","Rugissement","Tranche"],evoAt:30,evoTo:319},
  {id:319,n:"Sharpedo",t:["Eau","Ténèbres"],hp:70,atk:120,def:40,mv:["Surf","Morsure","Nuit Noire","Tranche"]},
  {id:333,n:"Tylton",t:["Normal","Vol"],hp:45,atk:40,def:60,mv:["Tornade","Vive-Attaque","Rugissement","Atterrissage"],evoAt:35,evoTo:334},
  {id:334,n:"Altaria",t:["Dragon","Vol"],hp:75,atk:70,def:90,mv:["Draco-Météore","Vol","Tranche","Vent Fabuleux"]},
  {id:359,n:"Absol",t:["Ténèbres"],hp:65,atk:130,def:60,mv:["Tranche","Nuit Noire","Morsure","Vive-Attaque"]},
  {id:363,n:"Obalie",t:["Glace","Eau"],hp:70,atk:40,def:50,mv:["Blizzard","Surf","Rugissement","Trempette"],evoAt:32,evoTo:364},
  {id:364,n:"Phogleur",t:["Glace","Eau"],hp:90,atk:60,def:70,mv:["Blizzard","Surf","Tranche","Rugissement"],evoAt:44,evoTo:365},
  {id:365,n:"Kaimorse",t:["Glace","Eau"],hp:110,atk:80,def:90,mv:["Blizzard","Surf","Séisme","Hyper Faisceau"]},
  {id:371,n:"Draby",t:["Dragon"],hp:45,atk:75,def:60,mv:["Draco-Météore","Morsure","Rugissement","Charge"],evoAt:30,evoTo:372},
  {id:372,n:"Shelgon",t:["Dragon"],hp:65,atk:95,def:100,mv:["Draco-Météore","Tranche","Morsure","Rugissement"],evoAt:50,evoTo:373},
  {id:373,n:"Drattak",t:["Dragon","Vol"],hp:95,atk:135,def:80,mv:["Draco-Météore","Vol","Tranche","Séisme"]},
  {id:374,n:"Terhal",t:["Acier","Psy"],hp:40,atk:55,def:80,mv:["Lance Métal","Psyko","Rugissement","Charge"],evoAt:20,evoTo:375},
  {id:375,n:"Métang",t:["Acier","Psy"],hp:60,atk:75,def:100,mv:["Lance Métal","Psyko","Rugissement","Tranche"],evoAt:45,evoTo:376},
  {id:376,n:"Métalosse",t:["Acier","Psy"],hp:80,atk:135,def:130,mv:["Lance Métal","Psyko","Séisme","Hyper Faisceau"]},
  {id:380,n:"Latias",t:["Dragon","Psy"],hp:80,atk:80,def:90,mv:["Psyko","Draco-Météore","Éclat Magique","Vent Fabuleux"],leg:true},
  {id:381,n:"Latios",t:["Dragon","Psy"],hp:80,atk:90,def:80,mv:["Psyko","Draco-Météore","Lance-Soleil","Vent Fabuleux"],leg:true},
  {id:382,n:"Kyogre",t:["Eau"],hp:100,atk:150,def:90,mv:["Surf","Blizzard","Tonnerre","Aqua-Queue"],leg:true},
  {id:383,n:"Groudon",t:["Sol"],hp:100,atk:150,def:140,mv:["Séisme","Lance-Soleil","Fracass'Roc","Tranche"],leg:true},
  {id:384,n:"Rayquaza",t:["Dragon","Vol"],hp:105,atk:150,def:90,mv:["Draco-Météore","Séisme","Vive-Attaque","Vol"],leg:true},
  {id:385,n:"Jirachi",t:["Acier","Psy"],hp:100,atk:100,def:100,mv:["Vœu Soin","Psyko","Lance Métal","Tonnerre Sacré"],leg:true},
  {id:386,n:"Deoxys",t:["Psy"],hp:50,atk:150,def:50,mv:["Psyko","Hyper Faisceau","Tranche","Orage"],leg:true},
  // ── GEN IV — SINNOH ───────────────────────────────────────────
  {id:387,n:"Tortipouss",t:["Plante"],hp:55,atk:68,def:64,mv:["Giga-Sangsue","Tranch'Herbe","Rugissement","Charge"],evoAt:18,evoTo:388},
  {id:388,n:"Torterreur",t:["Plante"],hp:75,atk:89,def:85,mv:["Lance-Soleil","Giga-Sangsue","Tranche","Rugissement"],evoAt:32,evoTo:389},
  {id:389,n:"Torterra",t:["Plante","Sol"],hp:95,atk:109,def:105,mv:["Lance-Soleil","Séisme","Tranche","Hyper Faisceau"]},
  {id:390,n:"Ouisticram",t:["Feu"],hp:44,atk:58,def:44,mv:["Flammèche","Griffe","Rugissement","Charge"],evoAt:14,evoTo:391},
  {id:391,n:"Chimpenfeu",t:["Feu","Combat"],hp:64,atk:78,def:52,mv:["Lance-Flammes","Poing Karaté","Tranche","Rugissement"],evoAt:36,evoTo:392},
  {id:392,n:"Simiabraz",t:["Feu","Combat"],hp:76,atk:104,def:71,mv:["Déflagration","Poing Karaté","Tranche","Séisme"]},
  {id:393,n:"Tiplouf",t:["Eau"],hp:53,atk:51,def:53,mv:["Pistolet à O","Rugissement","Charge","Vive-Attaque"],evoAt:16,evoTo:394},
  {id:394,n:"Prinplouf",t:["Eau"],hp:64,atk:66,def:68,mv:["Surf","Pistolet à O","Tranche","Rugissement"],evoAt:36,evoTo:395},
  {id:395,n:"Pingoléon",t:["Eau","Acier"],hp:84,atk:86,def:88,mv:["Surf","Lance Métal","Séisme","Hyper Faisceau"]},
  {id:396,n:"Étourmi",t:["Normal","Vol"],hp:40,atk:55,def:30,mv:["Tornade","Coup d'Aile","Rugissement","Vive-Attaque"],evoAt:14,evoTo:397},
  {id:397,n:"Étourvol",t:["Normal","Vol"],hp:55,atk:85,def:50,mv:["Tornade","Coup d'Aile","Tranche","Vive-Attaque"],evoAt:34,evoTo:398},
  {id:398,n:"Étouraptor",t:["Normal","Vol"],hp:85,atk:120,def:70,mv:["Vol","Tornade","Tranche","Hyper Faisceau"]},
  {id:403,n:"Lixy",t:["Électrik"],hp:45,atk:65,def:34,mv:["Tonnerre","Vive-Attaque","Rugissement","Charge"],evoAt:15,evoTo:404},
  {id:404,n:"Luxio",t:["Électrik"],hp:60,atk:85,def:49,mv:["Tonnerre","Vive-Attaque","Tranche","Rugissement"],evoAt:30,evoTo:405},
  {id:405,n:"Luxray",t:["Électrik"],hp:80,atk:120,def:79,mv:["Tonnerre","Vive-Attaque","Tranche","Hyper Faisceau"]},
  {id:408,n:"Kranidos",t:["Roche"],hp:67,atk:125,def:40,mv:["Fracass'Roc","Morsure","Rugissement","Charge"],evoAt:30,evoTo:409},
  {id:409,n:"Charkos",t:["Roche"],hp:97,atk:165,def:60,mv:["Fracass'Roc","Morsure","Séisme","Hyper Faisceau"]},
  {id:443,n:"Griknot",t:["Dragon"],hp:58,atk:70,def:45,mv:["Draco-Météore","Morsure","Rugissement","Charge"],evoAt:24,evoTo:444},
  {id:444,n:"Carmache",t:["Dragon"],hp:68,atk:90,def:65,mv:["Draco-Météore","Morsure","Tranche","Rugissement"],evoAt:48,evoTo:445},
  {id:445,n:"Carchacrok",t:["Dragon","Sol"],hp:108,atk:130,def:95,mv:["Draco-Météore","Séisme","Tranche","Hyper Faisceau"]},
  {id:447,n:"Riolu",t:["Combat"],hp:40,atk:70,def:40,mv:["Poing Karaté","Vive-Attaque","Rugissement","Charge"]},
  {id:448,n:"Lucario",t:["Combat","Acier"],hp:70,atk:110,def:70,mv:["Aurasphère","Lance Métal","Tranche","Vive-Attaque"]},
  {id:449,n:"Hippopotas",t:["Sol"],hp:68,atk:72,def:78,mv:["Séisme","Rugissement","Morsure","Charge"],evoAt:34,evoTo:450},
  {id:450,n:"Hippodocus",t:["Sol"],hp:108,atk:112,def:118,mv:["Séisme","Morsure","Fracass'Roc","Hyper Faisceau"]},
  {id:459,n:"Blizzi",t:["Plante","Glace"],hp:60,atk:62,def:50,mv:["Blizzard","Tranch'Herbe","Rugissement","Charge"],evoAt:40,evoTo:460},
  {id:460,n:"Blizzaroi",t:["Plante","Glace"],hp:90,atk:92,def:75,mv:["Blizzard","Lance-Soleil","Tranche","Hyper Faisceau"]},
  {id:461,n:"Dimoret",t:["Glace","Ténèbres"],hp:70,atk:120,def:65,mv:["Blizzard","Nuit Noire","Tranche","Vive-Attaque"]},
  {id:468,n:"Togekiss",t:["Fée","Vol"],hp:85,atk:50,def:95,mv:["Tonnerre Sacré","Vent Fabuleux","Éclat Magique","Vol"]},
  {id:471,n:"Givrali",t:["Glace"],hp:65,atk:60,def:110,mv:["Blizzard","Rugissement","Tranche","Hyper Faisceau"]},
  {id:473,n:"Mammochon",t:["Glace","Sol"],hp:110,atk:130,def:80,mv:["Blizzard","Séisme","Tranche","Hyper Faisceau"]},
  {id:475,n:"Gallame",t:["Psy","Combat"],hp:68,atk:125,def:65,mv:["Psyko","Poing Karaté","Tranche","Hyper Faisceau"]},
  {id:478,n:"Momartik",t:["Glace","Spectre"],hp:70,atk:80,def:70,mv:["Blizzard","Tranche-Ombre","Rugissement","Vive-Attaque"]},
  {id:479,n:"Motisma",t:["Électrik","Spectre"],hp:50,atk:50,def:77,mv:["Tonnerre","Tranche-Ombre","Poing Ombre","Rugissement"]},
  {id:483,n:"Dialga",t:["Acier","Dragon"],hp:100,atk:120,def:120,mv:["Draco-Météore","Lance Métal","Tonnerre","Séisme"],leg:true},
  {id:484,n:"Palkia",t:["Eau","Dragon"],hp:90,atk:120,def:100,mv:["Draco-Météore","Surf","Tonnerre","Séisme"],leg:true},
  {id:485,n:"Heatran",t:["Feu","Acier"],hp:91,atk:90,def:106,mv:["Lance-Flammes","Lance Métal","Séisme","Tranche"],leg:true},
  {id:487,n:"Giratina",t:["Spectre","Dragon"],hp:150,atk:100,def:120,mv:["Châtiment","Draco-Météore","Tranche-Ombre","Rugissement"],leg:true},
  {id:488,n:"Cresselia",t:["Psy"],hp:120,atk:75,def:110,mv:["Psyko","Éclat Magique","Rugissement","Tranche"],leg:true},
  {id:491,n:"Darkrai",t:["Ténèbres"],hp:70,atk:90,def:90,mv:["Nuit Noire","Morsure","Tranche","Rugissement"],leg:true},
  {id:492,n:"Shaymin",t:["Plante"],hp:100,atk:100,def:100,mv:["Lance-Soleil","Giga-Sangsue","Vœu Soin","Rugissement"],leg:true},
  // ── GEN V — UNOVA ─────────────────────────────────────────────
  {id:495,n:"Vipélierre",t:["Plante"],hp:45,atk:45,def:55,mv:["Fouet Lianes","Giga-Sangsue","Rugissement","Charge"],evoAt:17,evoTo:496},
  {id:496,n:"Lianaja",t:["Plante"],hp:60,atk:60,def:75,mv:["Fouet Lianes","Lame-Feuille","Giga-Sangsue","Rugissement"],evoAt:36,evoTo:497},
  {id:497,n:"Majaspic",t:["Plante"],hp:75,atk:75,def:95,mv:["Lance-Soleil","Lame-Feuille","Tranche","Séisme"]},
  {id:498,n:"Gruikui",t:["Feu"],hp:65,atk:63,def:45,mv:["Flammèche","Griffe","Rugissement","Charge"],evoAt:17,evoTo:499},
  {id:499,n:"Grotichon",t:["Feu"],hp:90,atk:93,def:55,mv:["Lance-Flammes","Griffe","Tranche","Rugissement"],evoAt:36,evoTo:500},
  {id:500,n:"Roitiflam",t:["Feu","Combat"],hp:110,atk:123,def:65,mv:["Déflagration","Poing Karaté","Séisme","Hyper Faisceau"]},
  {id:501,n:"Moustillon",t:["Eau"],hp:55,atk:45,def:40,mv:["Pistolet à O","Tranche","Rugissement","Charge"],evoAt:17,evoTo:502},
  {id:502,n:"Mateloutre",t:["Eau"],hp:75,atk:65,def:60,mv:["Surf","Tranche","Pistolet à O","Rugissement"],evoAt:36,evoTo:503},
  {id:503,n:"Clamiral",t:["Eau"],hp:95,atk:95,def:85,mv:["Surf","Tranche","Séisme","Hyper Faisceau"]},
  {id:504,n:"Ratentif",t:["Normal"],hp:56,atk:50,def:50,mv:["Morsure","Charge","Rugissement","Vive-Attaque"],evoAt:20,evoTo:505},
  {id:505,n:"Miradar",t:["Normal"],hp:75,atk:80,def:70,mv:["Morsure","Tranche","Vive-Attaque","Séisme"]},
  {id:509,n:"Chacripan",t:["Ténèbres"],hp:41,atk:50,def:37,mv:["Morsure","Vive-Attaque","Rugissement","Jackpot"],evoAt:20,evoTo:510},
  {id:510,n:"Léopardus",t:["Ténèbres"],hp:74,atk:76,def:50,mv:["Nuit Noire","Vive-Attaque","Tranche","Séisme"]},
  {id:519,n:"Poichigeon",t:["Normal","Vol"],hp:50,atk:55,def:50,mv:["Tornade","Coup d'Aile","Rugissement","Vive-Attaque"],evoAt:21,evoTo:520},
  {id:520,n:"Colombeau",t:["Normal","Vol"],hp:62,atk:77,def:62,mv:["Tornade","Coup d'Aile","Tranche","Vive-Attaque"],evoAt:32,evoTo:521},
  {id:521,n:"Déflaisan",t:["Normal","Vol"],hp:80,atk:95,def:80,mv:["Vol","Tornade","Tranche","Hyper Faisceau"]},
  {id:524,n:"Nodulithe",t:["Roche"],hp:40,atk:65,def:85,mv:["Jet-Pierres","Charge","Défense","Rugissement"],evoAt:25,evoTo:525},
  {id:525,n:"Géolithe",t:["Roche"],hp:55,atk:95,def:115,mv:["Fracass'Roc","Séisme","Rugissement","Tranche"],evoAt:40,evoTo:526},
  {id:526,n:"Gigalithe",t:["Roche"],hp:85,atk:135,def:130,mv:["Fracass'Roc","Séisme","Tranche","Hyper Faisceau"]},
  {id:551,n:"Mascaïman",t:["Sol","Ténèbres"],hp:50,atk:72,def:35,mv:["Morsure","Séisme","Rugissement","Charge"],evoAt:29,evoTo:552},
  {id:552,n:"Escroco",t:["Sol","Ténèbres"],hp:70,atk:92,def:65,mv:["Morsure","Séisme","Nuit Noire","Tranche"]},
  {id:554,n:"Darumarond",t:["Feu"],hp:70,atk:90,def:45,mv:["Lance-Flammes","Déflagration","Rugissement","Vive-Attaque"]},
  {id:570,n:"Zorua",t:["Ténèbres"],hp:40,atk:65,def:40,mv:["Nuit Noire","Morsure","Rugissement","Griffe"],evoAt:30,evoTo:571},
  {id:571,n:"Zoroark",t:["Ténèbres"],hp:60,atk:105,def:60,mv:["Nuit Noire","Tranche","Morsure","Hyper Faisceau"]},
  {id:610,n:"Coupenotte",t:["Dragon"],hp:46,atk:87,def:60,mv:["Draco-Météore","Morsure","Rugissement","Charge"],evoAt:38,evoTo:611},
  {id:611,n:"Incisache",t:["Dragon"],hp:66,atk:117,def:70,mv:["Draco-Météore","Morsure","Tranche","Rugissement"],evoAt:48,evoTo:612},
  {id:612,n:"Tranchodon",t:["Dragon"],hp:105,atk:147,def:90,mv:["Draco-Météore","Séisme","Tranche","Hyper Faisceau"]},
  {id:613,n:"Polarhume",t:["Glace"],hp:55,atk:70,def:40,mv:["Blizzard","Poing Karaté","Rugissement","Charge"],evoAt:37,evoTo:614},
  {id:614,n:"Polagriffe",t:["Glace"],hp:95,atk:110,def:80,mv:["Blizzard","Poing Karaté","Séisme","Hyper Faisceau"]},
  {id:621,n:"Drakkarmin",t:["Dragon"],hp:52,atk:80,def:50,mv:["Draco-Météore","Tranche","Rugissement","Charge"]},
  {id:625,n:"Scalproie",t:["Ténèbres","Acier"],hp:65,atk:125,def:100,mv:["Nuit Noire","Lance Métal","Tranche","Hyper Faisceau"]},
  {id:633,n:"Solochi",t:["Ténèbres","Dragon"],hp:52,atk:65,def:50,mv:["Draco-Météore","Morsure","Rugissement","Charge"],evoAt:50,evoTo:634},
  {id:634,n:"Diamat",t:["Ténèbres","Dragon"],hp:72,atk:85,def:70,mv:["Draco-Météore","Nuit Noire","Tranche","Rugissement"],evoAt:64,evoTo:635},
  {id:635,n:"Trioxhydre",t:["Ténèbres","Dragon"],hp:92,atk:105,def:90,mv:["Draco-Météore","Nuit Noire","Séisme","Hyper Faisceau"]},
  {id:636,n:"Pyronille",t:["Insecte","Feu"],hp:55,atk:85,def:55,mv:["Flammèche","Dard-Venin","Rugissement","Charge"],evoAt:59,evoTo:637},
  {id:637,n:"Pyrax",t:["Insecte","Feu"],hp:85,atk:60,def:65,mv:["Déflagration","Dard-Venin","Tranche","Hyper Faisceau"]},
  {id:638,n:"Cobaltium",t:["Acier","Combat"],hp:91,atk:90,def:129,mv:["Lance Métal","Poing Karaté","Séisme","Rugissement"],leg:true},
  {id:639,n:"Terrakium",t:["Roche","Combat"],hp:91,atk:129,def:90,mv:["Fracass'Roc","Poing Karaté","Séisme","Rugissement"],leg:true},
  {id:640,n:"Viridium",t:["Plante","Combat"],hp:91,atk:90,def:72,mv:["Lance-Soleil","Poing Karaté","Lame-Feuille","Rugissement"],leg:true},
  {id:641,n:"Boréas",t:["Vol"],hp:79,atk:115,def:70,mv:["Vent Fabuleux","Tornade","Tranche","Rugissement"],leg:true},
  {id:642,n:"Fulguris",t:["Électrik","Vol"],hp:79,atk:115,def:70,mv:["Tonnerre","Tornade","Tranche","Rugissement"],leg:true},
  {id:643,n:"Reshiram",t:["Dragon","Feu"],hp:100,atk:120,def:100,mv:["Tir de Feu","Draco-Météore","Lance-Soleil","Rugissement"],leg:true},
  {id:644,n:"Zekrom",t:["Dragon","Électrik"],hp:100,atk:150,def:120,mv:["Voltacle","Draco-Météore","Lance Métal","Rugissement"],leg:true},
  {id:645,n:"Démétéros",t:["Sol","Vol"],hp:89,atk:125,def:90,mv:["Séisme","Vent Fabuleux","Tranche","Rugissement"],leg:true},
  {id:646,n:"Kyurem",t:["Dragon","Glace"],hp:125,atk:130,def:90,mv:["Blizzard","Draco-Météore","Séisme","Rugissement"],leg:true},
  {id:647,n:"Keldeo",t:["Eau","Combat"],hp:91,atk:72,def:90,mv:["Surf","Poing Karaté","Aqua-Queue","Rugissement"],leg:true},
  {id:649,n:"Genesect",t:["Insecte","Acier"],hp:71,atk:120,def:95,mv:["Lance Métal","Coup Lame","Séisme","Hyper Faisceau"],leg:true},
  // ── GEN VI — KALOS ────────────────────────────────────────────
  {id:650,n:"Marisson",t:["Plante"],hp:56,atk:61,def:65,mv:["Feuille Rasoir","Jackpot","Rugissement","Charge"],evoAt:16,evoTo:651},
  {id:651,n:"Boguérande",t:["Plante"],hp:61,atk:77,def:85,mv:["Lame-Feuille","Feuille Rasoir","Tranche","Rugissement"],evoAt:36,evoTo:652},
  {id:652,n:"Blindépique",t:["Plante","Combat"],hp:88,atk:107,def:122,mv:["Lance-Soleil","Poing Karaté","Séisme","Hyper Faisceau"]},
  {id:653,n:"Feunnec",t:["Feu"],hp:41,atk:56,def:51,mv:["Flammèche","Griffe","Rugissement","Charge"],evoAt:16,evoTo:654},
  {id:654,n:"Roussil",t:["Feu","Psy"],hp:59,atk:59,def:58,mv:["Lance-Flammes","Psyko","Tranche","Rugissement"],evoAt:36,evoTo:655},
  {id:655,n:"Goupelin",t:["Feu","Psy"],hp:85,atk:103,def:80,mv:["Déflagration","Psyko","Tranche","Hyper Faisceau"]},
  {id:656,n:"Grenousse",t:["Eau"],hp:41,atk:56,def:40,mv:["Pistolet à O","Tranche","Rugissement","Charge"],evoAt:16,evoTo:657},
  {id:657,n:"Croâporal",t:["Eau"],hp:54,atk:63,def:52,mv:["Surf","Tranche","Pistolet à O","Rugissement"],evoAt:36,evoTo:658},
  {id:658,n:"Amphinobi",t:["Eau","Ténèbres"],hp:72,atk:95,def:67,mv:["Surf","Nuit Noire","Tranche","Hyper Faisceau"]},
  {id:667,n:"Hélionceau",t:["Feu","Normal"],hp:62,atk:50,def:58,mv:["Flammèche","Rugissement","Morsure","Charge"],evoAt:35,evoTo:668},
  {id:668,n:"Némélios",t:["Feu","Normal"],hp:86,atk:68,def:72,mv:["Lance-Flammes","Déflagration","Tranche","Hyper Faisceau"]},
  {id:669,n:"Flabébé",t:["Fée"],hp:54,atk:45,def:47,mv:["Éclat Magique","Rugissement","Charge","Vent Fabuleux"]},
  {id:670,n:"Floette",t:["Fée"],hp:78,atk:65,def:68,mv:["Éclat Magique","Vent Fabuleux","Tonnerre Sacré","Rugissement"]},
  {id:674,n:"Pandespiègle",t:["Combat"],hp:67,atk:82,def:62,mv:["Poing Karaté","Morsure","Rugissement","Charge"],evoAt:32,evoTo:675},
  {id:675,n:"Pandarbare",t:["Combat","Ténèbres"],hp:95,atk:124,def:78,mv:["Poing Karaté","Nuit Noire","Séisme","Hyper Faisceau"]},
  {id:677,n:"Psystigri",t:["Psy"],hp:62,atk:48,def:54,mv:["Psyko","Rugissement","Charge","Éclat Magique"],evoAt:25,evoTo:678},
  {id:678,n:"Mistigrix",t:["Psy"],hp:74,atk:48,def:76,mv:["Psyko","Éclat Magique","Hyper Faisceau","Rugissement"]},
  {id:686,n:"Sepiatop",t:["Ténèbres","Psy"],hp:53,atk:54,def:53,mv:["Nuit Noire","Psyko","Rugissement","Charge"],evoAt:30,evoTo:687},
  {id:687,n:"Sepiatroce",t:["Ténèbres","Psy"],hp:86,atk:92,def:88,mv:["Nuit Noire","Psyko","Tranche","Hyper Faisceau"]},
  {id:696,n:"Ptyranidur",t:["Roche","Dragon"],hp:58,atk:89,def:77,mv:["Fracass'Roc","Draco-Météore","Rugissement","Charge"],evoAt:39,evoTo:697},
  {id:697,n:"Rexillius",t:["Roche","Dragon"],hp:82,atk:121,def:119,mv:["Fracass'Roc","Draco-Météore","Séisme","Hyper Faisceau"]},
  {id:700,n:"Nymphali",t:["Fée"],hp:95,atk:65,def:65,mv:["Éclat Magique","Vent Fabuleux","Gros Câlin","Tonnerre Sacré"]},
  {id:701,n:"Brutalibré",t:["Combat","Vol"],hp:78,atk:92,def:75,mv:["Poing Karaté","Vol","Tranche","Hyper Faisceau"]},
  {id:704,n:"Mucuscule",t:["Dragon"],hp:45,atk:50,def:35,mv:["Draco-Météore","Rugissement","Charge","Gros Câlin"],evoAt:40,evoTo:705},
  {id:705,n:"Colimucus",t:["Dragon"],hp:68,atk:75,def:53,mv:["Draco-Météore","Tranche","Rugissement","Gros Câlin"],evoAt:50,evoTo:706},
  {id:706,n:"Muplodocus",t:["Dragon"],hp:90,atk:100,def:70,mv:["Draco-Météore","Tranche","Séisme","Hyper Faisceau"]},
  {id:714,n:"Sonistrelle",t:["Vol","Dragon"],hp:40,atk:30,def:35,mv:["Draco-Météore","Atterrissage","Rugissement","Charge"],evoAt:48,evoTo:715},
  {id:715,n:"Bruyverne",t:["Vol","Dragon"],hp:85,atk:70,def:80,mv:["Draco-Météore","Vol","Tranche","Hyper Faisceau"]},
  {id:716,n:"Xerneas",t:["Fée"],hp:126,atk:131,def:95,mv:["Géo-Contrôle","Éclat Magique","Vent Fabuleux","Tonnerre Sacré"],leg:true},
  {id:717,n:"Yveltal",t:["Ténèbres","Vol"],hp:126,atk:131,def:95,mv:["Rayon Ombral","Nuit Noire","Atterrissage","Mort-Vie"],leg:true},
  {id:718,n:"Zygarde",t:["Dragon","Sol"],hp:108,atk:100,def:121,mv:["Draco-Météore","Séisme","Tranche","Rugissement"],leg:true},
  {id:719,n:"Diancie",t:["Roche","Fée"],hp:50,atk:100,def:150,mv:["Fracass'Roc","Éclat Magique","Tonnerre Sacré","Rugissement"],leg:true},
  {id:720,n:"Hoopa",t:["Psy","Spectre"],hp:80,atk:110,def:60,mv:["Psyko","Tranche-Ombre","Hyper Faisceau","Rugissement"],leg:true},
  {id:721,n:"Volcanion",t:["Feu","Eau"],hp:80,atk:110,def:120,mv:["Déflagration","Surf","Séisme","Rugissement"],leg:true},
];

// ═══════════════════════════════════════════════════════════════════
//  RÉGIONS & ZONES — Kanto → Kalos + voyage inter-régions
// ═══════════════════════════════════════════════════════════════════
const REGIONS = {
  "Kanto":  {starters:[{id:1,n:"Bulbizarre",t:"Plante/Poison"},{id:4,n:"Salamèche",t:"Feu"},{id:7,n:"Carapuce",t:"Eau"}], totalBadges:8, color:"#cc0000"},
  "Johto":  {starters:[{id:152,n:"Germignon",t:"Plante"},{id:155,n:"Héricendre",t:"Feu"},{id:158,n:"Kaiminus",t:"Eau"}], totalBadges:8, color:"#3b82f6"},
  "Hoenn":  {starters:[{id:252,n:"Arcko",t:"Plante"},{id:255,n:"Poussifeu",t:"Feu"},{id:258,n:"Gobou",t:"Eau"}], totalBadges:8, color:"#10b981"},
  "Sinnoh": {starters:[{id:387,n:"Tortipouss",t:"Plante"},{id:390,n:"Ouisticram",t:"Feu"},{id:393,n:"Tiplouf",t:"Eau"}], totalBadges:8, color:"#8b5cf6"},
  "Unova":  {starters:[{id:495,n:"Vipélierre",t:"Plante"},{id:498,n:"Gruikui",t:"Feu"},{id:501,n:"Moustillon",t:"Eau"}], totalBadges:8, color:"#f59e0b"},
  "Kalos":  {starters:[{id:650,n:"Marisson",t:"Plante"},{id:653,n:"Feunnec",t:"Feu"},{id:656,n:"Grenousse",t:"Eau"}], totalBadges:8, color:"#ec4899"},
};

const ZONES = {
  // ── KANTO ────────────────────────────────────────────────────
  "Bourg Palette":    {region:"Kanto",wild:[16,19,35],min:2,max:5,mapX:2,mapY:8,theme:"village",connects:["Route 1","Laboratoire Chen"],pkCenter:false,shop:false,gym:null,desc:"La ville natale paisible, pleine de promesses."},
  "Laboratoire Chen": {region:"Kanto",wild:[],min:2,max:2,mapX:2,mapY:7,theme:"lab",connects:["Bourg Palette"],pkCenter:false,shop:false,gym:null,desc:"Le laboratoire du Professeur Chen."},
  "Route 1":          {region:"Kanto",wild:[16,19,37],min:3,max:6,mapX:2,mapY:6,theme:"route",connects:["Bourg Palette","Jadielle"],pkCenter:false,shop:false,gym:null,desc:"Chemin herbeux entre Bourg Palette et Jadielle."},
  "Jadielle":         {region:"Kanto",wild:[16,19,39,41],min:4,max:8,mapX:2,mapY:5,theme:"city",connects:["Route 1","Forêt de Jade","Argenta"],pkCenter:true,shop:true,gym:null,desc:"Première ville avec un Centre Pokémon."},
  "Forêt de Jade":    {region:"Kanto",wild:[41,43,25,69],min:5,max:12,mapX:3,mapY:4,theme:"forest",connects:["Jadielle","Argenta"],pkCenter:false,shop:false,gym:null,desc:"Forêt mystérieuse aux chemins tortueux."},
  "Argenta":          {region:"Kanto",wild:[16,19,41,74],min:8,max:14,mapX:4,mapY:4,theme:"city",connects:["Forêt de Jade","Jadielle","Route 3"],pkCenter:true,shop:true,gym:{badge:0,leader:"Pierre",lvl:12,pkmIds:[74,74],reward:1500},desc:"Ville minière célèbre pour son Arène Roche."},
  "Route 3":          {region:"Kanto",wild:[19,35,37,39,54,63],min:10,max:17,mapX:5,mapY:4,theme:"route",connects:["Argenta","Mt. Sélénite"],pkCenter:false,shop:false,gym:null,desc:"Route animée menant aux montagnes."},
  "Mt. Sélénite":     {region:"Kanto",wild:[41,42,50,74,75,92],min:12,max:20,mapX:6,mapY:3,theme:"cave",connects:["Route 3","Azuria"],pkCenter:false,shop:false,gym:null,desc:"Grotte sombre habitée de Pokémon souterrains."},
  "Azuria":           {region:"Kanto",wild:[54,60,79,129],min:15,max:22,mapX:7,mapY:4,theme:"city",connects:["Mt. Sélénite","Route 6","Carmin"],pkCenter:true,shop:true,gym:{badge:1,leader:"Ondine",lvl:21,pkmIds:[54,54,55],reward:2500},desc:"Ville côtière aux eaux cristallines."},
  "Route 6":          {region:"Kanto",wild:[16,19,39,63,66],min:18,max:24,mapX:8,mapY:5,theme:"route",connects:["Azuria","Carmin"],pkCenter:false,shop:false,gym:null,desc:"Route reliant Azuria à Carmin."},
  "Carmin":           {region:"Kanto",wild:[16,19,25,26,58],min:20,max:28,mapX:9,mapY:5,theme:"city",connects:["Route 6","Céladopole","Grotte Taupiqueur"],pkCenter:true,shop:true,gym:{badge:2,leader:"Lt. Surge",lvl:28,pkmIds:[25,26],reward:3500},desc:"Ville militaire bouillonnante d'énergie."},
  "Céladopole":       {region:"Kanto",wild:[43,44,69,79,109,113],min:25,max:33,mapX:9,mapY:3,theme:"city",connects:["Carmin","Parmanie","Safran"],pkCenter:true,shop:true,gym:{badge:3,leader:"Érika",lvl:29,pkmIds:[69,44,71],reward:4000},desc:"Grande métropole, cœur de Kanto."},
  "Grotte Taupiqueur":{region:"Kanto",wild:[50,74,75,104,92],min:22,max:32,mapX:8,mapY:3,theme:"cave",connects:["Carmin","Parmanie"],pkCenter:false,shop:false,gym:null,desc:"Réseau de galeries souterraines."},
  "Parmanie":         {region:"Kanto",wild:[16,41,54,79,123],min:28,max:38,mapX:9,mapY:1,theme:"city",connects:["Céladopole","Grotte Taupiqueur","Safran"],pkCenter:true,shop:true,gym:{badge:4,leader:"Koga",lvl:37,pkmIds:[109,109,110],reward:5000},desc:"Ville côtière avec l'Arène Poison."},
  "Safran":           {region:"Kanto",wild:[63,64,39,35,133],min:30,max:42,mapX:9,mapY:2,theme:"city",connects:["Parmanie","Céladopole","Cramois'île"],pkCenter:true,shop:true,gym:{badge:5,leader:"Sabrina",lvl:42,pkmIds:[64,79,64],reward:6000},desc:"Cœur technologique de Kanto."},
  "Cramois'île":      {region:"Kanto",wild:[37,58,79,113,123],min:35,max:48,mapX:7,mapY:1,theme:"volcano",connects:["Safran","Gris Mérule"],pkCenter:true,shop:false,gym:{badge:6,leader:"Blaine",lvl:47,pkmIds:[58,79,58],reward:7000},desc:"Île volcanique isolée dans les flots."},
  "Gris Mérule":      {region:"Kanto",wild:[52,53,79,130,131,147],min:40,max:55,mapX:5,mapY:1,theme:"city",connects:["Cramois'île","Plateau Indigo"],pkCenter:true,shop:true,gym:{badge:7,leader:"Giovanni",lvl:53,pkmIds:[104,50,79],reward:10000},desc:"Ville portuaire, repaire de la Team Rocket."},
  "Plateau Indigo":   {region:"Kanto",wild:[131,130,147,148,79],min:45,max:60,mapX:3,mapY:1,theme:"elite",connects:["Gris Mérule","⬡ Vers Johto"],pkCenter:true,shop:false,gym:null,desc:"Sanctuaire des Champions — destination ultime de Kanto."},
  "Grotte Inconnue":  {region:"Kanto",wild:[144,145,146,150,151],min:50,max:70,mapX:2,mapY:2,theme:"cave",connects:["Plateau Indigo"],pkCenter:false,shop:false,gym:null,desc:"Grotte mystérieuse aux créatures légendaires."},
  // ── JOHTO ────────────────────────────────────────────────────
  "Bourg Écorce":     {region:"Johto",wild:[161,163,172],min:2,max:5,mapX:2,mapY:8,theme:"village",connects:["Route J1","Labo. Bourgoin"],pkCenter:false,shop:false,gym:null,desc:"Village paisible de Johto, point de départ d'une nouvelle aventure."},
  "Labo. Bourgoin":   {region:"Johto",wild:[],min:2,max:2,mapX:2,mapY:7,theme:"lab",connects:["Bourg Écorce"],pkCenter:false,shop:false,gym:null,desc:"Le laboratoire du Professeur Bourgoin."},
  "Route J1":         {region:"Johto",wild:[161,163,172],min:3,max:6,mapX:2,mapY:6,theme:"route",connects:["Bourg Écorce","Bourg Parme"],pkCenter:false,shop:false,gym:null,desc:"Première route de Johto, agréable et calme."},
  "Bourg Parme":      {region:"Johto",wild:[161,163,43],min:4,max:8,mapX:3,mapY:5,theme:"city",connects:["Route J1","Grotte Sable Rose","Bourg Stade"],pkCenter:true,shop:true,gym:{badge:0,leader:"Faulkner",lvl:12,pkmIds:[163,164],reward:1500},desc:"Ville connue pour son Arène Vol."},
  "Grotte Sable Rose":{region:"Johto",wild:[41,42,74,104,92],min:6,max:14,mapX:4,mapY:4,theme:"cave",connects:["Bourg Parme","Bourg Stade"],pkCenter:false,shop:false,gym:null,desc:"Grotte rose au sable brillant."},
  "Bourg Stade":      {region:"Johto",wild:[179,183,35],min:10,max:18,mapX:5,mapY:4,theme:"city",connects:["Grotte Sable Rose","Bourg Parme","Bourg Doublonpolis"],pkCenter:true,shop:true,gym:{badge:1,leader:"Tamara",lvl:20,pkmIds:[183,184],reward:2500},desc:"Ville réputée pour ses championnats Pokémon."},
  "Bourg Doublonpolis":{region:"Johto",wild:[163,179,207],min:15,max:25,mapX:6,mapY:3,theme:"city",connects:["Bourg Stade","Tour Cramoisie","Bourg Aster"],pkCenter:true,shop:true,gym:{badge:2,leader:"Fandango",lvl:25,pkmIds:[200,200],reward:3000},desc:"Ville hantée célèbre pour sa tour mystérieuse."},
  "Tour Cramoisie":   {region:"Johto",wild:[200,92,93],min:18,max:28,mapX:7,mapY:3,theme:"cave",connects:["Bourg Doublonpolis"],pkCenter:false,shop:false,gym:null,desc:"Tour spectrale hantée par des esprits anciens."},
  "Bourg Aster":      {region:"Johto",wild:[196,163,196],min:20,max:30,mapX:8,mapY:4,theme:"city",connects:["Bourg Doublonpolis","Safari Parc","Bourg Oliville"],pkCenter:true,shop:true,gym:{badge:3,leader:"Mila",lvl:29,pkmIds:[182,182],reward:4000},desc:"Ville des fleurs et de la nature."},
  "Safari Parc":      {region:"Johto",wild:[246,231,207,196,200],min:22,max:35,mapX:9,mapY:4,theme:"forest",connects:["Bourg Aster"],pkCenter:false,shop:false,gym:null,desc:"Immense réserve naturelle avec des Pokémon rares."},
  "Bourg Oliville":   {region:"Johto",wild:[179,180,163,228],min:25,max:38,mapX:9,mapY:2,theme:"city",connects:["Bourg Aster","Bourg Acajou","Grotte Cristal"],pkCenter:true,shop:true,gym:{badge:4,leader:"Jasmine",lvl:35,pkmIds:[208,208],reward:5000},desc:"Port industriel avec l'Arène Acier."},
  "Grotte Cristal":   {region:"Johto",wild:[246,247,215,216,42],min:28,max:42,mapX:8,mapY:1,theme:"cave",connects:["Bourg Oliville","Bourg Acajou"],pkCenter:false,shop:false,gym:null,desc:"Grotte de cristal aux couleurs éblouissantes."},
  "Bourg Acajou":     {region:"Johto",wild:[215,216,228,246],min:32,max:45,mapX:7,mapY:1,theme:"city",connects:["Bourg Oliville","Grotte Cristal","Bourg Sapin"],pkCenter:true,shop:true,gym:{badge:5,leader:"Mortimer",lvl:40,pkmIds:[229,229],reward:6000},desc:"Ville nordique glaciale avec l'Arène Feu."},
  "Bourg Sapin":      {region:"Johto",wild:[227,217,231,232],min:38,max:52,mapX:6,mapY:1,theme:"city",connects:["Bourg Acajou","Plateau Victoire J"],pkCenter:true,shop:true,gym:{badge:6,leader:"Anice",lvl:45,pkmIds:[221,221],reward:7000},desc:"Ville des glaces avec l'Arène Glace."},
  "Bourg Parisia":    {region:"Johto",wild:[196,197,242,175],min:35,max:50,mapX:5,mapY:2,theme:"city",connects:["Bourg Sapin","Plateau Victoire J"],pkCenter:true,shop:true,gym:{badge:7,leader:"Clair",lvl:50,pkmIds:[148,148,149],reward:10000},desc:"Fief des dresseurs de Dragon, ville emblématique."},
  "Plateau Victoire J":{region:"Johto",wild:[232,248,197,242],min:45,max:60,mapX:4,mapY:1,theme:"elite",connects:["Bourg Parisia","⬡ Vers Hoenn"],pkCenter:true,shop:false,gym:null,desc:"Le Plateau Victoire de Johto — destination finale."},
  // ── HOENN ─────────────────────────────────────────────────────
  "Bourg Littleroot": {region:"Hoenn",wild:[261,263,278],min:2,max:5,mapX:2,mapY:8,theme:"village",connects:["Route H1","Labo. Birch"],pkCenter:false,shop:false,gym:null,desc:"Petit bourg côtier de Hoenn, au parfum d'aventure."},
  "Labo. Birch":      {region:"Hoenn",wild:[],min:2,max:2,mapX:2,mapY:7,theme:"lab",connects:["Bourg Littleroot"],pkCenter:false,shop:false,gym:null,desc:"Le laboratoire du Professeur Birch."},
  "Route H1":         {region:"Hoenn",wild:[261,263,278],min:3,max:6,mapX:2,mapY:6,theme:"route",connects:["Bourg Littleroot","Bourg Olmaurac"],pkCenter:false,shop:false,gym:null,desc:"Première route de Hoenn, longeant la mer."},
  "Bourg Olmaurac":   {region:"Hoenn",wild:[261,263,278,280],min:4,max:8,mapX:3,mapY:5,theme:"city",connects:["Route H1","Bourg Petalburg","Forêt Petalburg"],pkCenter:true,shop:true,gym:{badge:0,leader:"Roxane",lvl:15,pkmIds:[74,74],reward:1500},desc:"Première ville de Hoenn avec son Arène Roche."},
  "Forêt Petalburg":  {region:"Hoenn",wild:[278,261,280,270],min:5,max:12,mapX:4,mapY:4,theme:"forest",connects:["Bourg Olmaurac","Bourg Petalburg"],pkCenter:false,shop:false,gym:null,desc:"Forêt luxuriante aux Pokémon Insecte."},
  "Bourg Petalburg":  {region:"Hoenn",wild:[278,279,183,270],min:10,max:18,mapX:5,mapY:4,theme:"city",connects:["Forêt Petalburg","Bourg Olmaurac","Bourg Mérouville"],pkCenter:true,shop:true,gym:{badge:1,leader:"Norman",lvl:28,pkmIds:[277,277],reward:2500},desc:"Ville côtière avec l'Arène Normal."},
  "Bourg Mérouville": {region:"Hoenn",wild:[278,279,296,309],min:15,max:25,mapX:6,mapY:3,theme:"city",connects:["Bourg Petalburg","Mt. Rouage","Bourg Zéphyrville"],pkCenter:true,shop:true,gym:{badge:2,leader:"Wattson",lvl:22,pkmIds:[309,309],reward:3000},desc:"Ville d'énergie électrique bourdonnante."},
  "Mt. Rouage":       {region:"Hoenn",wild:[333,280,296,309],min:18,max:28,mapX:7,mapY:3,theme:"cave",connects:["Bourg Mérouville","Bourg Ectoplastica"],pkCenter:false,shop:false,gym:null,desc:"Montagne volcanique active aux tunnels de lave."},
  "Bourg Ectoplastica":{region:"Hoenn",wild:[302,200,92,280],min:22,max:32,mapX:8,mapY:3,theme:"city",connects:["Mt. Rouage","Bourg Verdanturf","Bourg Nénuvar"],pkCenter:true,shop:true,gym:{badge:3,leader:"Winona",lvl:31,pkmIds:[333,334],reward:4000},desc:"Ville flottante célèbre pour son Arène Vol."},
  "Bourg Verdanturf": {region:"Hoenn",wild:[315,43,280,270],min:20,max:30,mapX:7,mapY:4,theme:"city",connects:["Bourg Ectoplastica","Bourg Mérouville"],pkCenter:true,shop:true,gym:null,desc:"Ville verdoyante aux fleurs sauvages."},
  "Bourg Nénuvar":    {region:"Hoenn",wild:[318,278,315,270],min:28,max:40,mapX:9,mapY:4,theme:"city",connects:["Bourg Ectoplastica","Bourg Lavandia"],pkCenter:true,shop:true,gym:{badge:4,leader:"Téalia",lvl:37,pkmIds:[318,319],reward:5000},desc:"Port animé avec l'Arène Eau."},
  "Bourg Lavandia":   {region:"Hoenn",wild:[363,371,318,302],min:32,max:45,mapX:9,mapY:2,theme:"city",connects:["Bourg Nénuvar","Bourg Mossdeep"],pkCenter:true,shop:true,gym:{badge:5,leader:"Brawly",lvl:42,pkmIds:[302,302],reward:6000},desc:"Ville calme sous les flocons de neige."},
  "Bourg Mossdeep":   {region:"Hoenn",wild:[371,374,302,363],min:38,max:52,mapX:8,mapY:1,theme:"city",connects:["Bourg Lavandia","Tour Céleste","Bourg Sootopolis"],pkCenter:true,shop:true,gym:{badge:6,leader:"Tate & Liza",lvl:46,pkmIds:[374,375],reward:7000},desc:"Île isolée avec la Base Spatiale et l'Arène Psy."},
  "Tour Céleste":     {region:"Hoenn",wild:[380,381,384,249],min:45,max:70,mapX:7,mapY:1,theme:"elite",connects:["Bourg Mossdeep"],pkCenter:false,shop:false,gym:null,desc:"Tour légendaire où résident Rayquaza et les légendaires."},
  "Bourg Sootopolis": {region:"Hoenn",wild:[363,365,382,383],min:42,max:58,mapX:6,mapY:1,theme:"city",connects:["Bourg Mossdeep","Ligue Hoenn"],pkCenter:true,shop:true,gym:{badge:7,leader:"Juan",lvl:50,pkmIds:[363,364,365],reward:10000},desc:"Cité mystérieuse dans un cratère volcanique rempli d'eau."},
  "Ligue Hoenn":      {region:"Hoenn",wild:[373,376,384,380,381],min:50,max:65,mapX:5,mapY:1,theme:"elite",connects:["Bourg Sootopolis","⬡ Vers Sinnoh"],pkCenter:true,shop:false,gym:null,desc:"Le Conseil des Champions de Hoenn."},
  // ── SINNOH ────────────────────────────────────────────────────
  "Bourg Bonaugure":  {region:"Sinnoh",wild:[396,399,403],min:2,max:5,mapX:2,mapY:8,theme:"village",connects:["Route S1","Labo. Rowan"],pkCenter:false,shop:false,gym:null,desc:"Petit village paisible du nord de Sinnoh."},
  "Labo. Rowan":      {region:"Sinnoh",wild:[],min:2,max:2,mapX:2,mapY:7,theme:"lab",connects:["Bourg Bonaugure"],pkCenter:false,shop:false,gym:null,desc:"Le laboratoire du Professeur Rowan."},
  "Route S1":         {region:"Sinnoh",wild:[396,399,403],min:3,max:6,mapX:2,mapY:6,theme:"route",connects:["Bourg Bonaugure","Bourg Troisport"],pkCenter:false,shop:false,gym:null,desc:"Route enneigée bordant le Lac Vérité."},
  "Bourg Troisport":  {region:"Sinnoh",wild:[396,399,403,408],min:4,max:8,mapX:3,mapY:5,theme:"city",connects:["Route S1","Bourg Veillechaume","Mines Oreburgh"],pkCenter:true,shop:true,gym:{badge:0,leader:"Roark",lvl:15,pkmIds:[408,408,409],reward:1500},desc:"Ville minière avec l'Arène Roche."},
  "Mines Oreburgh":   {region:"Sinnoh",wild:[408,524,74,104],min:8,max:15,mapX:4,mapY:5,theme:"cave",connects:["Bourg Troisport"],pkCenter:false,shop:false,gym:null,desc:"Mines souterraines riches en fossiles."},
  "Bourg Veillechaume":{region:"Sinnoh",wild:[396,403,404,525],min:10,max:20,mapX:5,mapY:4,theme:"city",connects:["Bourg Troisport","Forêt Eterna","Bourg Cœlembourg"],pkCenter:true,shop:true,gym:{badge:1,leader:"Gardenia",lvl:22,pkmIds:[43,44,315],reward:2500},desc:"Ville de la forêt éternelle avec l'Arène Plante."},
  "Forêt Eterna":     {region:"Sinnoh",wild:[43,280,396,447,459],min:12,max:20,mapX:4,mapY:3,theme:"forest",connects:["Bourg Veillechaume","Bourg Cœlembourg"],pkCenter:false,shop:false,gym:null,desc:"Forêt ancienne et mystérieuse peuplée de Pokémon rares."},
  "Bourg Cœlembourg": {region:"Sinnoh",wild:[403,404,405,524],min:18,max:28,mapX:6,mapY:3,theme:"city",connects:["Bourg Veillechaume","Forêt Eterna","Bourg Flabébé"],pkCenter:true,shop:true,gym:{badge:2,leader:"Maylene",lvl:32,pkmIds:[447,448],reward:3500},desc:"Dojo des arts martiaux avec l'Arène Combat."},
  "Bourg Flabébé":    {region:"Sinnoh",wild:[442,200,479,396],min:22,max:32,mapX:7,mapY:3,theme:"city",connects:["Bourg Cœlembourg","Lac Valeur","Bourg Congel"],pkCenter:true,shop:true,gym:{badge:3,leader:"Fantina",lvl:36,pkmIds:[200,442],reward:4000},desc:"Ville animée avec son célèbre Hôtel Grand Lac."},
  "Lac Valeur":       {region:"Sinnoh",wild:[489,490,480,481,482],min:25,max:40,mapX:6,mapY:2,theme:"route",connects:["Bourg Flabébé"],pkCenter:false,shop:false,gym:null,desc:"Lac sacré gardé par les créatures légendaires Lac."},
  "Bourg Congel":     {region:"Sinnoh",wild:[459,460,461,215,473],min:28,max:40,mapX:8,mapY:2,theme:"city",connects:["Bourg Flabébé","Mt. Couronné","Bourg Flotroit"],pkCenter:true,shop:true,gym:{badge:4,leader:"Byron",lvl:40,pkmIds:[208,208,410],reward:5000},desc:"Ville nordique glaciale avec l'Arène Acier."},
  "Mt. Couronné":     {region:"Sinnoh",wild:[459,460,461,443,444],min:30,max:45,mapX:7,mapY:1,theme:"cave",connects:["Bourg Congel"],pkCenter:false,shop:false,gym:null,desc:"Montagne sacrée où le temps et l'espace se croisent."},
  "Bourg Flotroit":   {region:"Sinnoh",wild:[442,200,479,280],min:32,max:45,mapX:9,mapY:3,theme:"city",connects:["Bourg Congel","Mt. Acuity","Bourg Pivanne"],pkCenter:true,shop:true,gym:{badge:5,leader:"Candice",lvl:44,pkmIds:[459,460,478],reward:6000},desc:"Ville enneigée avec l'Arène Glace."},
  "Mt. Acuity":       {region:"Sinnoh",wild:[480,481,482,478,215],min:38,max:55,mapX:9,mapY:1,theme:"cave",connects:["Bourg Flotroit"],pkCenter:false,shop:false,gym:null,desc:"Lac sacré perché au sommet d'une montagne."},
  "Bourg Pivanne":    {region:"Sinnoh",wild:[443,444,445,214],min:38,max:52,mapX:8,mapY:1,theme:"city",connects:["Bourg Flotroit","Ligue Sinnoh"],pkCenter:true,shop:true,gym:{badge:6,leader:"Volkner",lvl:50,pkmIds:[405,405,479],reward:7000},desc:"Ville côtière avec l'Arène Électrik."},
  "Distortion World": {region:"Sinnoh",wild:[487,200,442,93],min:45,max:70,mapX:5,mapY:1,theme:"cave",connects:["Mt. Couronné"],pkCenter:false,shop:false,gym:null,desc:"Le monde de Giratina — une dimension inversée et terrifiante."},
  "Ligue Sinnoh":     {region:"Sinnoh",wild:[445,448,473,483,484],min:50,max:65,mapX:6,mapY:1,theme:"elite",connects:["Bourg Pivanne","⬡ Vers Unys"],pkCenter:true,shop:false,gym:null,desc:"Le Conseil des Champions de Sinnoh."},
  // ── UNOVA ─────────────────────────────────────────────────────
  "Renouet":          {region:"Unova",wild:[504,519,501],min:2,max:5,mapX:2,mapY:8,theme:"village",connects:["Route U1","Labo. Keteleeria"],pkCenter:false,shop:false,gym:null,desc:"Ville natale d'Unys, berceau d'une nouvelle aventure."},
  "Labo. Keteleeria": {region:"Unova",wild:[],min:2,max:2,mapX:2,mapY:7,theme:"lab",connects:["Renouet"],pkCenter:false,shop:false,gym:null,desc:"Le laboratoire de la Professeure Keteleeria."},
  "Route U1":         {region:"Unova",wild:[504,519,509],min:3,max:6,mapX:2,mapY:6,theme:"route",connects:["Renouet","Arabelle"],pkCenter:false,shop:false,gym:null,desc:"Route herbeuse au bord d'une rivière tranquille."},
  "Arabelle":         {region:"Unova",wild:[504,519,509,524],min:4,max:8,mapX:3,mapY:5,theme:"city",connects:["Route U1","Ogoesse"],pkCenter:true,shop:true,gym:null,desc:"Petite ville animée — premier contact avec la Team Plasma."},
  "Ogoesse":          {region:"Unova",wild:[519,520,509,524],min:8,max:14,mapX:4,mapY:4,theme:"city",connects:["Arabelle","Forêt d'Empoigne","Maillard"],pkCenter:true,shop:true,gym:{badge:0,leader:"Noa, Rachid et Armando",lvl:14,pkmIds:[495,498,501],reward:1500},desc:"Ville du Trio des Champions avec ses trois frères Pokémon."},
  "Forêt d'Empoigne": {region:"Unova",wild:[519,504,551,636,637],min:10,max:18,mapX:5,mapY:4,theme:"forest",connects:["Ogoesse","Maillard"],pkCenter:false,shop:false,gym:null,desc:"Forêt dense traversée par des chemins anciens."},
  "Maillard":         {region:"Unova",wild:[504,519,551],min:14,max:22,mapX:6,mapY:3,theme:"city",connects:["Forêt d'Empoigne","Volucité"],pkCenter:true,shop:true,gym:{badge:1,leader:"Aloé",lvl:20,pkmIds:[504,505],reward:2500},desc:"Ville des arts et musées avec l'Arène Normal."},
  "Volucité":         {region:"Unova",wild:[519,509,636],min:18,max:28,mapX:7,mapY:3,theme:"city",connects:["Maillard","Méanville"],pkCenter:true,shop:true,gym:{badge:2,leader:"Artie",lvl:24,pkmIds:[636,637],reward:3500},desc:"Grande métropole bouillonnante avec l'Arène Insecte."},
  "Méanville":        {region:"Unova",wild:[524,525,526],min:22,max:32,mapX:8,mapY:3,theme:"city",connects:["Volucité","Port Yoneuve"],pkCenter:true,shop:true,gym:{badge:3,leader:"Inezia",lvl:30,pkmIds:[524,525,526],reward:4000},desc:"Ville des sports et divertissements avec l'Arène Électrik."},
  "Port Yoneuve":     {region:"Unova",wild:[551,552,621],min:28,max:38,mapX:9,mapY:3,theme:"city",connects:["Méanville","Parsemille"],pkCenter:true,shop:true,gym:{badge:4,leader:"Bardane",lvl:35,pkmIds:[551,552,524],reward:5000},desc:"Port marchand avec l'Arène Sol."},
  "Parsemille":       {region:"Unova",wild:[519,521,570,633],min:32,max:42,mapX:9,mapY:1,theme:"city",connects:["Port Yoneuve","Flocombe"],pkCenter:true,shop:true,gym:{badge:5,leader:"Carolina",lvl:40,pkmIds:[519,521,398],reward:6000},desc:"Ville de l'aéroport avec l'Arène Vol."},
  "Flocombe":         {region:"Unova",wild:[613,614,221],min:38,max:50,mapX:8,mapY:1,theme:"city",connects:["Parsemille","Tour Dragospire","Janusia"],pkCenter:true,shop:true,gym:{badge:6,leader:"Zhu",lvl:44,pkmIds:[613,614],reward:7000},desc:"Ville des glaces et des marais avec l'Arène Glace."},
  "Tour Dragospire":  {region:"Unova",wild:[643,644,633,634,635],min:45,max:70,mapX:7,mapY:1,theme:"elite",connects:["Flocombe"],pkCenter:false,shop:false,gym:null,desc:"Tour ancestrale où résident Reshiram et Zekrom."},
  "Janusia":          {region:"Unova",wild:[610,611,612,621],min:42,max:55,mapX:6,mapY:1,theme:"city",connects:["Flocombe","Ligue d'Unys"],pkCenter:true,shop:true,gym:{badge:7,leader:"Iris et Watson",lvl:50,pkmIds:[610,611,612],reward:10000},desc:"Ville du Dragon avec l'Arène Dragon."},
  "Ligue d'Unys":     {region:"Unova",wild:[637,635,644,643,649],min:50,max:65,mapX:5,mapY:1,theme:"elite",connects:["Janusia","⬡ Vers Kalos"],pkCenter:true,shop:false,gym:null,desc:"Le Conseil des Champions d'Unys."},
  // ── KALOS ─────────────────────────────────────────────────────
  "Bourg Vaniville":  {region:"Kalos",wild:[667,669,674],min:2,max:5,mapX:2,mapY:8,theme:"village",connects:["Route K1","Labo. Platane"],pkCenter:false,shop:false,gym:null,desc:"Village romantique au pied des montagnes de Kalos."},
  "Labo. Platane":    {region:"Kalos",wild:[],min:2,max:2,mapX:2,mapY:7,theme:"lab",connects:["Bourg Vaniville"],pkCenter:false,shop:false,gym:null,desc:"Le laboratoire du Professeur Platane."},
  "Route K1":         {region:"Kalos",wild:[667,669,674,677],min:3,max:6,mapX:2,mapY:6,theme:"route",connects:["Bourg Vaniville","Quarellis"],pkCenter:false,shop:false,gym:null,desc:"Route champêtre fleurie de Kalos."},
  "Quarellis":        {region:"Kalos",wild:[667,669,677,686],min:4,max:8,mapX:3,mapY:5,theme:"city",connects:["Route K1","Neuvartault"],pkCenter:true,shop:true,gym:null,desc:"Charmant bourg au bord de l'eau."},
  "Neuvartault":      {region:"Kalos",wild:[667,686,669],min:8,max:14,mapX:4,mapY:4,theme:"city",connects:["Quarellis","Illumis","Forêt de Neuvartault"],pkCenter:true,shop:true,gym:{badge:0,leader:"Violette",lvl:14,pkmIds:[667,686],reward:1500},desc:"Ville de la fontaine et de l'Arène Insecte."},
  "Forêt de Neuvartault": {region:"Kalos",wild:[667,669,674,686,704],min:5,max:12,mapX:3,mapY:3,theme:"forest",connects:["Neuvartault"],pkCenter:false,shop:false,gym:null,desc:"Forêt enchantée aux Pokémon minuscules."},
  "Illumis":          {region:"Kalos",wild:[677,678,669,686],min:12,max:22,mapX:5,mapY:3,theme:"city",connects:["Neuvartault","Fort-Vanitas","Relifac-le-Haut"],pkCenter:true,shop:true,gym:{badge:1,leader:"Lem",lvl:24,pkmIds:[403,404,405],reward:2500},desc:"Capitale lumineuse de Kalos avec la Tour Prismatique."},
  "Fort-Vanitas":     {region:"Kalos",wild:[674,667,669],min:10,max:20,mapX:4,mapY:2,theme:"city",connects:["Illumis","Palais Chaydeuvre"],pkCenter:true,shop:true,gym:null,desc:"Ville royale avec son château parfumé."},
  "Palais Chaydeuvre":{region:"Kalos",wild:[674,670,669],min:12,max:20,mapX:3,mapY:2,theme:"elite",connects:["Fort-Vanitas"],pkCenter:false,shop:false,gym:null,desc:"Palais somptueux entouré de jardins de fleurs."},
  "Relifac-le-Haut":  {region:"Kalos",wild:[696,339,349,278],min:18,max:28,mapX:6,mapY:2,theme:"city",connects:["Illumis","Cromlac'h","Yantreizh"],pkCenter:true,shop:true,gym:{badge:2,leader:"Lino",lvl:28,pkmIds:[696,697],reward:3500},desc:"Ville des falaises et de l'escalade avec l'Arène Roche."},
  "Yantreizh":        {region:"Kalos",wild:[677,280,281,282],min:22,max:32,mapX:7,mapY:3,theme:"city",connects:["Relifac-le-Haut","Port Tempères"],pkCenter:true,shop:true,gym:{badge:3,leader:"Cornélia",lvl:34,pkmIds:[447,448],reward:4000},desc:"Ville de la Tour de la Maîtrise avec l'Arène Combat."},
  "Port Tempères":    {region:"Kalos",wild:[669,670,677],min:26,max:36,mapX:8,mapY:3,theme:"city",connects:["Yantreizh","Illumis","Romant-sous-Bois"],pkCenter:true,shop:true,gym:{badge:4,leader:"Amaro",lvl:39,pkmIds:[650,651,652],reward:5000},desc:"Ville sur pilotis avec son monorail et l'Arène Plante."},
  "Romant-sous-Bois": {region:"Kalos",wild:[704,714,686,669],min:32,max:44,mapX:9,mapY:2,theme:"city",connects:["Port Tempères","La Frescale"],pkCenter:true,shop:true,gym:{badge:5,leader:"Valériane",lvl:44,pkmIds:[700,669,670],reward:6000},desc:"Ville des marécages avec l'Arène Fée."},
  "La Frescale":      {region:"Kalos",wild:[704,714,686,613],min:36,max:48,mapX:9,mapY:1,theme:"route",connects:["Romant-sous-Bois","Flusselles"],pkCenter:true,shop:false,gym:null,desc:"Village moulin sous la neige éternelle."},
  "Flusselles":       {region:"Kalos",wild:[714,715,704,677],min:40,max:54,mapX:8,mapY:1,theme:"city",connects:["La Frescale","Mozheim"],pkCenter:true,shop:true,gym:{badge:6,leader:"Astéra",lvl:48,pkmIds:[677,678,475],reward:7000},desc:"Ville du Cadran Solaire avec l'Arène Psy."},
  "Mozheim":          {region:"Kalos",wild:[714,715,610,704],min:44,max:58,mapX:7,mapY:1,theme:"city",connects:["Flusselles","Auffrac-les-Congères"],pkCenter:true,shop:true,gym:null,desc:"Village pont entre deux régions enneigées."},
  "Auffrac-les-Congères": {region:"Kalos",wild:[715,612,461,478],min:48,max:60,mapX:6,mapY:1,theme:"city",connects:["Mozheim","Ligue de Kalos"],pkCenter:true,shop:true,gym:{badge:7,leader:"Urup",lvl:54,pkmIds:[614,461,460],reward:10000},desc:"Ville hivernale avec la dernière Arène de Kalos."},
  "Ligue de Kalos":   {region:"Kalos",wild:[715,706,719,716,717],min:55,max:70,mapX:5,mapY:1,theme:"elite",connects:["Auffrac-les-Congères"],pkCenter:true,shop:false,gym:null,desc:"Le Conseil des Champions de Kalos — ultime défi."},
  "Tour de la Vie":   {region:"Kalos",wild:[716,717,718,719,720],min:60,max:80,mapX:4,mapY:1,theme:"elite",connects:["Ligue de Kalos"],pkCenter:false,shop:false,gym:null,desc:"Tour mystérieuse où Xerneas et Yveltal gardent l'équilibre."},
};

// Badges par région
const REGION_BADGES = {
  "Kanto":  ["🪨","💧","⚡","🌈","💜","🧠","🌋","🌍"],
  "Johto":  ["🪶","💊","🌊","🌸","⚙️","👁️","🧊","🐉"],
  "Hoenn":  ["🪨","⚡","🔥","🌊","🌪️","🧠","🌐","🌊"],
  "Sinnoh": ["🪨","🌿","👊","👻","⚙️","🧊","⚡","🐉"],
  "Unova":  ["🌿","🔥","🐛","⚡","🌍","🌪️","🧊","🐉"],
  "Kalos":  ["🐛","⚡","🪨","👊","🌿","🧚","🔮","🧊"],
};

// Portails inter-régions (déblocage après 3 badges)
const REGION_PORTALS = {
  "⬡ Vers Johto":  {dest:"Bourg Écorce",  region:"Johto",  minBadges:3},
  "⬡ Vers Hoenn":  {dest:"Bourg Littleroot",region:"Hoenn", minBadges:3},
  "⬡ Vers Sinnoh": {dest:"Bourg Bonaugure",region:"Sinnoh", minBadges:3},
  "⬡ Vers Unys":   {dest:"Renouet",       region:"Unova",  minBadges:3},
  "⬡ Vers Kalos":  {dest:"Bourg Vaniville",region:"Kalos", minBadges:3},
};

// ═══════════════════════════════════════════════════════════════════
//  ITEMS & BADGES
// ═══════════════════════════════════════════════════════════════════
const ITEMS_DB = [
  {id:"pokeball",n:"Poké Ball",e:"🔴",p:200,type:"ball",rate:1.2},
  {id:"superball",n:"Super Ball",e:"🔵",p:600,type:"ball",rate:2},
  {id:"hyperball",n:"Hyper Ball",e:"🟡",p:1200,type:"ball",rate:3.5},
  {id:"masterball",n:"Master Ball",e:"⭐",p:0,type:"ball",rate:999},
  {id:"potion",n:"Potion",e:"💊",p:300,type:"heal",heal:20},
  {id:"superpotion",n:"Super Potion",e:"💉",p:700,type:"heal",heal:50},
  {id:"hyperpotion",n:"Hyper Potion",e:"🧪",p:1200,type:"heal",heal:200},
  {id:"fullrestore",n:"Guérison",e:"✨",p:3000,type:"heal",heal:9999},
  {id:"revive",n:"Rappel",e:"💫",p:1500,type:"revive"},
  {id:"antidote",n:"Antidote",e:"🟢",p:100,type:"status"},
  {id:"repel",n:"Repousse",e:"🌫️",p:350,type:"repel"},
];

// (badges affichés via REGION_BADGES selon la région du joueur)

// ═══════════════════════════════════════════════════════════════════
//  TYPE COLORS
// ═══════════════════════════════════════════════════════════════════
const TYPE_CLR = {
  "Plante":"#4caf50","Poison":"#9c27b0","Feu":"#ff6b35","Eau":"#2196f3",
  "Électrik":"#ffc107","Psy":"#e91e8c","Normal":"#9e9e9e","Dragon":"#1565c0",
  "Vol":"#64b5f6","Spectre":"#37474f","Roche":"#795548","Sol":"#8d6e63",
  "Glace":"#80deea","Combat":"#bf360c","Insecte":"#8bc34a","Acier":"#90a4ae",
  "Ténèbres":"#424242","Fée":"#f48fb1"
};

// ═══════════════════════════════════════════════════════════════════
//  NARRATIVE EVENTS
// ═══════════════════════════════════════════════════════════════════
const EVENTS = {
  "Bourg Palette":[
    (p,o)=>`Le Professeur Chen sort en courant de son labo : "Ah, ${p} ! Parfait timing ! Des comportements étranges ont été signalés sur la Route 1. Quelqu'un a aperçu un Pokémon d'une couleur inhabituelle…" Il te glisse une Potion dans la main.\n\nDans ta rue, tu remarques des traces de semelles inconnues dans la boue. Quelqu'un est passé ici récemment.`,
    (p,o)=>`Ta mère t'appelle depuis la fenêtre : "Sois prudent(e) !" Elle t'a préparé un sac avec des provisions.${o?` Au coin de la rue, ${o} te fait signe : "Tu pars déjà ? Je te rejoins !"`:` Un dresseur local t'interpelle : "Tu pars à l'aventure ? Bonne chance !"`}`,
    (p)=>`Un vieux dresseur à la retraite t'aborde : "Tu vois ce ciel, ${p} ? Quand il prend cette teinte… c'est que quelque chose se prépare. Dans ma jeunesse, j'ai croisé Mewtwo sur le Plateau Indigo. Je ne l'ai jamais oublié." Il disparaît dans une ruelle.`,
  ],
  "Forêt de Jade":[
    (p,o)=>`La forêt devient sombre et oppressante. Un froissement dans les buissons — des yeux brillants te fixent.${o?` "${o}, tu entends ça ?" tu chuchotes.`:" Tu retiens ton souffle."} Deux membres de la Team Rocket surgissent d'un fourré, des filets à la main !\n\n"Gamin ! Cette forêt appartient à la Team Rocket ce soir. Demi-tour !"`,
    (p)=>`Tu trouves un Pokémon blessé entre les racines d'un vieux chêne — un Pikachu avec une entaille au flanc. Il te fixe avec méfiance mais ne fuit pas. Il semble épuisé et affamé.`,
    (p,o)=>`Les chemins de la forêt se ressemblent tous. Tu tournes en rond depuis 20 minutes${o?` quand ${o} attrape ton bras`:" quand une voix résonne"} : "Là ! Une lumière au nord !" Une lueur verdâtre perce à travers les branches…`,
  ],
  "Mt. Sélénite":[
    (p,o)=>`Dans les profondeurs de la grotte, ta torche éclaire des inscriptions récentes : "TEAM ROCKET — OPÉRATION FOSSILE — ACCÈS INTERDIT". Des voix résonnent plus bas. Deux agents en uniforme noir descendent dans votre direction${o?` — ${o} te tire par le bras`:""}. Ils n'ont pas encore vu.`,
    (p)=>`Un Géolithe colossal bloque le passage — bien plus grand que la normale. Ses yeux brillent d'un rouge intense. Il ne semble pas agressif... pour l'instant.`,
    (p)=>`Tu trouves une salle secrète éclairée par des cristaux luminescents. Au centre, une Poké Ball dorée sur un piédestal. Une inscription : "Celui qui mérite la force". Elle contient peut-être un Pokémon rare...`,
  ],
  "Azuria":[
    (p,o)=>`Le Musée d'Azuria a été cambriolé ! La Mew Fossilisée a disparu. Le directeur désespéré crie : "La Team Rocket ! Quelqu'un peut les poursuivre ?"${o?` Il regarde ${o} et toi avec espoir.`:" Il te regarde avec espoir."} Récompense : 5 000₽.`,
    (p)=>`Ondine t'aperçoit depuis son Arène : "Un nouveau challenger ? Enfin ! Mes Pokémon Eau s'ennuient. Va d'abord soigner ton équipe — je veux un combat loyal."`,
  ],
  "Carmin":[
    (p,o)=>`Dans un café bruyant, tu surprends une conversation suspecte : "L'opération démarre ce soir au Casino de Céladopole. Giovanni veut le stock avant minuit." Ils ne t'ont pas vu.${o?` Tu fais signe à ${o} de rester discret.`:""}`,
    (p)=>`Lt. Surge te toise depuis l'entrée de son Arène : "Tu veux mon badge ? Prouve que tu mérites l'électricité, recrue !" Il rit d'un rire tonitruant.`,
  ],
  "Safran":[
    (p,o)=>`La Tour Sylphe est occupée par la Team Rocket ! Giovanni supervise l'opération depuis le 11e étage.${o?` "${o}," tu souffles, "il faut monter par les escaliers de secours."`:" Les ascenseurs sont bloqués — il faut monter à pied."}`,
    (p)=>`Sabrina flotte quelques centimètres au-dessus du sol quand elle vous accueille. "J'ai vu votre arrivée il y a trois semaines," dit-elle d'une voix atone. "Dans mes rêves. Êtes-vous vraiment prêts ?"`,
  ],
  "Gris Mérule":[
    (p,o)=>`Giovanni te fixe depuis son fauteuil, son Persian ronronnant sur ses genoux. "Alors c'est toi qui as mis en échec mes opérations." Il se lève lentement.${o?` À tes côtés, ${o} serre sa Poké Ball en silence.`:""}`,
    (p,o)=>`Après la défaite de Giovanni, la Team Rocket se disperse. Le Maire te remet 15 000₽ et une Hyper Ball.${o?` ${o} te serre dans ses bras : "On l'a fait !"`:' "On l\'a fait !"'}`,
  ],
  "Plateau Indigo":[
    (p)=>`L'air ici est différent — chargé d'une énergie palpable. Les meilleurs dresseurs du monde s'entraînent sur ces chemins. Lorelei, du groupe des Quatre, te croise : "Nouveau challenger ? Personne n'a vaincu le Champion depuis trois ans."`,
    (p)=>`Une aura lumineuse enveloppe le Plateau. Au sommet d'un rocher, une silhouette observe la Ligue. Ses yeux violets brillent dans la pénombre. Mewtwo. Il te fixe spécifiquement, puis disparaît dans un flash aveuglant.`,
  ],
  "Grotte Inconnue":[
    (p)=>`L'obscurité ici est totale. Ta boussole tourne en rond. Une pensée qui n'est pas la tienne résonne : "Prouve ta valeur, dresseur. Ose t'approcher."`,
    (p)=>`Mewtwo se matérialise dans un tourbillon de télékinésie. Sa voix résonne dans ton esprit : "Tu as traversé toutes les épreuves. Bien. Mais pourquoi veux-tu me capturer ?"`,
  ],
};

const DEFAULT_EVENTS = [
  (p,o,loc)=>`Tu explores ${loc}.${o?` ${o} marche à ton côté, l'œil alerte.`:" Seul(e) sur le chemin,"} tu remarques des traces inhabituelles dans la poussière.`,
  (p,o,loc)=>`En chemin dans ${loc}, un vieux dresseur assis sur un rocher lève la tête : "La Team Rocket rôde dans le coin. Méfie-toi."`,
  (p,o,loc)=>`${loc} cache beaucoup de secrets. Tu trouves une vieille inscription sur un rocher : "Par ici se cache un trésor pour qui ose chercher."`,
  (p,o,loc)=>`Une brise étrange souffle sur ${loc}. Au loin, tu distingues une silhouette de dresseur qui s'entraîne avec ses Pokémon${o?` — ${o} plisse les yeux pour mieux voir`:""}. Quelque chose d'inhabituel se passe ici.`,
];

function getEvent(zone,pName,oName){
  const pool=EVENTS[zone]||DEFAULT_EVENTS;
  const fn=pool[Math.floor(Math.random()*pool.length)];
  return fn(pName,oName,zone);
}

// ═══════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════
const PKM_BY_ID = new Map(PKM.map(p=>[p.id,p]));
const gp=(id)=>PKM_BY_ID.get(id)||PKM[0];
const calcHP=(base,lvl)=>Math.floor((base*2*lvl)/100)+lvl+10;
const calcAtk=(base,lvl)=>Math.floor((base*2*lvl)/100)+5;
const calcXPN=(lvl)=>Math.floor(lvl*lvl*lvl*0.8);
const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const hpCol=r=>r>0.5?"#4caf50":r>0.25?"#ffc107":"#f44336";
const spriteUrl=(id,back=false,shiny=false)=>`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${back?"back/":""}${shiny?"shiny/":""}${id}.png`;
const norm=(value="")=>String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/⬡\s*vers\s*/g,"").replace(/[^a-z0-9]+/g," ").trim();
const regionLabel=(region)=>region==="Unova"?"Unys":(region||"Kanto");
const movePower=(name)=>MOVES_DB[name]?.pow??40;
const movePowerCap=(lvl)=>lvl<8?60:lvl<16?80:lvl<28?100:999;
const learnableMoveNames=(species,lvl)=>{
  const moves=species.mv||["Charge"];
  const cap=movePowerCap(lvl);
  const learned=moves.filter(name=>movePower(name)===0||movePower(name)<=cap);
  if(learned.length) return learned.slice(0,4);
  return ["Charge"];
};
const toMoveSlots=(names)=>names.slice(0,4).map(name=>({name,pp:20,maxpp:20}));
const normalizeKnownMoves=(pk)=>{
  const d=gp(pk.id);
  const allowed=learnableMoveNames(d,pk.level||5);
  const current=(pk.moves||[]).map(m=>typeof m==="string"?{name:m,pp:20,maxpp:20}:m).filter(m=>m?.name);
  const merged=[...current.filter(m=>allowed.includes(m.name)),...allowed.filter(name=>!current.some(m=>m.name===name)).map(name=>({name,pp:20,maxpp:20}))];
  return merged.slice(-4).map(m=>({name:m.name,pp:Math.min(m.pp??20,m.maxpp??20),maxpp:m.maxpp??20}));
};
const escapeHtml=(value="")=>String(value)
  .replace(/&/g,"&amp;")
  .replace(/</g,"&lt;")
  .replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;")
  .replace(/'/g,"&#039;");
const safeHtml=(value="")=>escapeHtml(value)
  .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
  .replace(/\*(.+?)\*/g,"<em>$1</em>")
  .replace(/&lt;(\/?)(strong|b|em)&gt;/g,"<$1$2>")
  .replace(/&lt;br\s*\/?&gt;/g,"<br/>")
  .replace(/\n/g,"<br/>");
const zoneChoices=(zone, player)=>[
  "Chercher des Pokémon",
  "Explorer la zone",
  ...(zone?.pkCenter?["Centre Pokémon"]:[]),
  ...(zone?.shop?["Magasin"]:[]),
  ...(zone?.gym&&!player?.badges?.includes(zone.gym.badge)?["Défier l'Arène"]:[]),
].filter(Boolean);

function makePkm(id,lvl){
  const d=gp(id);
  const mhp=calcHP(d.hp,lvl);
  return{uid:`${Date.now()}${Math.random()}`,id,name:d.n,types:d.t,level:lvl,
    exp:0,expN:calcXPN(lvl+1),hp:mhp,maxhp:mhp,
    moves:toMoveSlots(learnableMoveNames(d,lvl)),status:null,leg:!!d.leg};
}

function makePlayer(name,sid,isMain=false,region="Kanto"){
  const startLoc = region==="Johto"?"Bourg Écorce":region==="Hoenn"?"Bourg Littleroot":region==="Sinnoh"?"Bourg Bonaugure":region==="Unova"?"Renouet":region==="Kalos"?"Bourg Vaniville":"Bourg Palette";
  return{name,isMain,money:3000,badges:[],regionBadges:{},team:[makePkm(sid,5)],
    pc:[],inventory:{pokeball:5,potion:3},dex:[sid],location:startLoc,region};
}

function normalizeOwnedPkm(pk){
  const d=gp(pk?.id);
  const level=Math.max(1,pk?.level||5);
  const maxhp=pk?.maxhp||calcHP(d.hp,level);
  return{
    ...pk,
    id:d.id,
    name:d.n,
    types:d.t,
    level,
    exp:pk?.exp||0,
    expN:pk?.expN||calcXPN(level+1),
    hp:Math.max(0,Math.min(pk?.hp??maxhp,maxhp)),
    maxhp,
    moves:normalizeKnownMoves({...pk,id:d.id,level}),
    status:pk?.status||null,
    leg:!!d.leg,
    shiny:!!pk?.shiny,
    uid:pk?.uid||`${Date.now()}${Math.random()}`,
  };
}

function ensurePlayableState(state, playerIdx=0, fallbackName="Dresseur"){
  if(!state?.players?.length) return state;
  const next=JSON.parse(JSON.stringify(state));
  next.activePlayerIdx=Number.isInteger(next.activePlayerIdx)?next.activePlayerIdx:0;
  next.players=next.players.map((pl,i)=>({
    ...makePlayer(pl?.name||`Joueur ${i+1}`, pl?.team?.[0]?.id||STARTERS[i%STARTERS.length].id, !!pl?.isMain, pl?.region||next.players[0]?.region||"Kanto"),
    ...pl,
    badges:Array.isArray(pl?.badges)?pl.badges:[],
    pc:Array.isArray(pl?.pc)?pl.pc.map(normalizeOwnedPkm):[],
    team:Array.isArray(pl?.team)&&pl.team.length?pl.team.map(normalizeOwnedPkm):[makePkm(STARTERS[i%STARTERS.length].id,5)],
    inventory:pl?.inventory||{pokeball:5,potion:3},
    dex:Array.isArray(pl?.dex)?pl.dex:[pl?.team?.[0]?.id||STARTERS[i%STARTERS.length].id],
  }));
  while(next.players.length<=playerIdx){
    const region=next.players[0]?.region||"Kanto";
    next.players.push(makePlayer(playerIdx===next.players.length?fallbackName||`Joueur ${playerIdx+1}`:`Joueur ${next.players.length+1}`, STARTERS[next.players.length%STARTERS.length].id, false, region));
  }
  next.location=next.players[0]?.location||next.location||"Bourg Palette";
  return next;
}

function omniXP(players,xpTotal,allyUid,pidx=0){
  const msgs=[];
  const safeIdx=Math.min(pidx,players.length-1);
  const p=players[safeIdx]||players[0];
  if(!p)return msgs;
  const all=[...p.team,...p.pc];
  all.forEach(pk=>{
    if(pk.hp<=0&&p.team.some(t=>t.uid===pk.uid))return;
    const bonus=pk.uid===allyUid?1.5:1;
    pk.exp=(pk.exp||0)+Math.max(1,Math.floor(xpTotal*bonus/Math.max(1,all.length)));
    while(pk.exp>=pk.expN){
      pk.exp-=pk.expN;pk.level++;pk.expN=calcXPN(pk.level+1);
      const d=gp(pk.id);
      const old=pk.maxhp;pk.maxhp=calcHP(d.hp,pk.level);pk.hp=Math.min(pk.hp+(pk.maxhp-old),pk.maxhp);
      msgs.push({type:"level",text:`${pk.name} → Niveau ${pk.level} !`,id:pk.uid});
      const learned=learnableMoveNames(d,pk.level);
      learned.forEach(name=>{
        if(pk.moves.some(mv=>mv.name===name)) return;
        const newMove={name,pp:20,maxpp:20};
        if(pk.moves.length<4){
          pk.moves.push(newMove);
          msgs.push({type:"move",text:`${pk.name} apprend ${name} !`,id:pk.uid});
          return;
        }
        const weakestIdx=pk.moves.reduce((idx,mv,i)=>movePower(mv.name)<movePower(pk.moves[idx].name)?i:idx,0);
        if(movePower(name)>movePower(pk.moves[weakestIdx].name)){
          const oldMove=pk.moves[weakestIdx].name;
          pk.moves[weakestIdx]=newMove;
          msgs.push({type:"move",text:`${pk.name} oublie ${oldMove} et apprend ${name} !`,id:pk.uid});
        }
      });
      if(d.evoAt&&pk.level>=d.evoAt&&d.evoTo){
        const nd=gp(d.evoTo);
        msgs.push({type:"evo",text:`${pk.name} évolue en ${nd.n} !`,oldId:pk.id,newId:nd.id,uid:pk.uid});
        pk.id=nd.id;pk.name=nd.n;pk.types=nd.t;
        learnableMoveNames(nd,pk.level).forEach(name=>{
          if(pk.moves.some(mv=>mv.name===name)) return;
          if(pk.moves.length<4) pk.moves.push({name,pp:20,maxpp:20});
        });
        pk.moves=normalizeKnownMoves(pk);
      }
    }
  });
  return msgs;
}

// ═══════════════════════════════════════════════════════════════════
//  ZONE SCENE — Illustrations premium qualité RPG
// ═══════════════════════════════════════════════════════════════════
function ZoneScene({theme}){
  const W=200, H=118;

  const Village=()=>(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <linearGradient id="vsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a6fa8"/><stop offset="55%" stopColor="#4da6d4"/><stop offset="100%" stopColor="#7ec9e8"/>
        </linearGradient>
        <linearGradient id="vground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a9a2a"/><stop offset="100%" stopColor="#2d6a18"/>
        </linearGradient>
        <radialGradient id="vsun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff9c4"/><stop offset="60%" stopColor="#ffee58"/><stop offset="100%" stopColor="#ffd600"/>
        </radialGradient>
        <linearGradient id="vpath" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8b870"/><stop offset="100%" stopColor="#a09050"/>
        </linearGradient>
        <filter id="vshadow"><feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.4"/></filter>
        <filter id="vglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* Ciel */}
      <rect width={W} height={H} fill="url(#vsky)"/>
      {/* Nuages */}
      <g opacity="0.85">
        <ellipse cx={38} cy={22} rx={22} ry={9} fill="white"/>
        <ellipse cx={52} cy={17} rx={18} ry={11} fill="white"/>
        <ellipse cx={65} cy={22} rx={14} ry={8} fill="#f0f8ff"/>
      </g>
      <g opacity="0.7">
        <ellipse cx={148} cy={28} rx={16} ry={7} fill="white"/>
        <ellipse cx={160} cy={23} rx={14} ry={9} fill="white"/>
        <ellipse cx={172} cy={28} rx={12} ry={6} fill="#f0f8ff"/>
      </g>
      {/* Soleil */}
      <circle cx={175} cy={20} r={13} fill="url(#vsun)" filter="url(#vglow)"/>
      {/* Rayons soleil */}
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <line key={i} x1={175+Math.cos(a*Math.PI/180)*15} y1={20+Math.sin(a*Math.PI/180)*15} x2={175+Math.cos(a*Math.PI/180)*20} y2={20+Math.sin(a*Math.PI/180)*20} stroke="#ffd600" strokeWidth={1.5} opacity={0.6}/>
      ))}
      {/* Sol */}
      <rect x={0} y={72} width={W} height={H-72} fill="url(#vground)"/>
      {/* Herbe détaillée */}
      <path d="M0,72 Q25,65 50,72 Q75,68 100,72 Q125,66 150,72 Q175,67 200,72" fill="#5ab830" stroke="none"/>
      {/* Chemin */}
      <path d="M85,H L95,72 Q98,68 100,60 Q102,68 105,72 L115,118" fill="url(#vpath)" opacity="0.8"/>
      <rect x={86} y={72} width={28} height={46} fill="url(#vpath)" rx={2}/>
      {/* Maison gauche */}
      <g filter="url(#vshadow)">
        <rect x={22} y={44} width={46} height={34} fill="#d4a870" rx={1}/>
        <rect x={22} y={44} width={46} height={4} fill="#c49860"/>
        {/* Toit */}
        <polygon points="18,46 45,22 72,46" fill="#8b3a3a"/>
        <polygon points="18,46 45,22 72,46" fill="#a04444" opacity="0.5"/>
        {/* Ombre toit */}
        <polygon points="18,46 45,22 25,46" fill="#6b2a2a" opacity="0.3"/>
        {/* Fenêtre */}
        <rect x={30} y={52} width={10} height={10} fill="#87ceeb" rx={1}/>
        <rect x={30} y={52} width={10} height={1} fill="#ffffff" opacity="0.5"/>
        <line x1={35} y1={52} x2={35} y2={62} stroke="#6aaad4" strokeWidth={0.8}/>
        <line x1={30} y1={57} x2={40} y2={57} stroke="#6aaad4" strokeWidth={0.8}/>
        {/* Porte */}
        <rect x={47} y={60} width={12} height={18} fill="#6b4020" rx={1}/>
        <circle cx={57} cy={70} r={1.5} fill="#d4a840"/>
        {/* Cheminée */}
        <rect x={55} y={28} width={6} height={12} fill="#7a3030"/>
        <ellipse cx={58} cy={28} rx={4} ry={2} fill="#555" opacity="0.6"/>
      </g>
      {/* Maison droite */}
      <g filter="url(#vshadow)">
        <rect x={128} y={50} width={52} height={28} fill="#c8b090" rx={1}/>
        <polygon points="124,52 154,30 184,52" fill="#7a5030"/>
        <polygon points="124,52 154,30 135,52" fill="#5a3010" opacity="0.3"/>
        <rect x={136} y={57} width={10} height={9} fill="#87ceeb" rx={1}/>
        <line x1={141} y1={57} x2={141} y2={66} stroke="#6aaad4" strokeWidth={0.8}/>
        <line x1={136} y1={61} x2={146} y2={61} stroke="#6aaad4" strokeWidth={0.8}/>
        <rect x={155} y={62} width={10} height={16} fill="#5a3010" rx={1}/>
      </g>
      {/* Grand arbre */}
      <g>
        <rect x={98} y={58} width={5} height={16} fill="#5d3a1a"/>
        <ellipse cx={100} cy={50} rx={16} ry={18} fill="#2e7d32"/>
        <ellipse cx={100} cy={44} rx={12} ry={14} fill="#388e3c"/>
        <ellipse cx={97} cy={40} rx={8} ry={10} fill="#43a047"/>
        <ellipse cx={103} cy={42} rx={6} ry={8} fill="#43a047" opacity="0.7"/>
        {/* Reflets lumière */}
        <ellipse cx={95} cy={38} rx={5} ry={4} fill="#66bb6a" opacity="0.5"/>
      </g>
      {/* Fleurs */}
      {[[18,70,1.5,"#ff8080"],[25,68,1.2,"#ffb3de"],[170,69,1.5,"#ffff80"],[178,71,1.2,"#ff9090"]].map(([fx,fy,fr,fc],i)=>(
        <g key={i}><circle cx={fx} cy={fy} r={fr*2} fill={fc} opacity={0.8}/><circle cx={fx} cy={fy} r={fr} fill="#fff" opacity={0.6}/></g>
      ))}
    </svg>
  );

  const Route=()=>(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2980b9"/><stop offset="100%" stopColor="#87ceeb"/>
        </linearGradient>
        <linearGradient id="rground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#56b820"/><stop offset="100%" stopColor="#3d8a10"/>
        </linearGradient>
        <linearGradient id="rpath2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4c878"/><stop offset="100%" stopColor="#b0a458"/>
        </linearGradient>
        <linearGradient id="rmtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8da0b0"/><stop offset="40%" stopColor="#6a8090"/><stop offset="100%" stopColor="#4a6070"/>
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#rsky)"/>
      {/* Montagnes lointaines */}
      <polygon points="0,65 35,35 70,65" fill="url(#rmtn)" opacity="0.5"/>
      <polygon points="30,65 70,28 110,65" fill="url(#rmtn)" opacity="0.45"/>
      <polygon points="80,65 120,38 160,65" fill="url(#rmtn)" opacity="0.4"/>
      <polygon points="130,65 170,42 200,65" fill="url(#rmtn)" opacity="0.35"/>
      {/* Neige sommets */}
      <polygon points="35,35 42,42 28,42" fill="white" opacity="0.6"/>
      <polygon points="70,28 78,36 62,36" fill="white" opacity="0.65"/>
      <polygon points="120,38 127,45 113,45" fill="white" opacity="0.55"/>
      {/* Nuages */}
      {[[30,18,0.9],[100,12,0.8],[160,20,0.75]].map(([cx,cy,op],i)=>(
        <g key={i} opacity={op}>
          <ellipse cx={cx} cy={cy} rx={18} ry={7} fill="white"/>
          <ellipse cx={cx+10} cy={cy-4} rx={14} ry={9} fill="white"/>
          <ellipse cx={cx-8} cy={cy-2} rx={12} ry={7} fill="#f0f8ff"/>
        </g>
      ))}
      {/* Sol */}
      <rect x={0} y={65} width={W} height={H-65} fill="url(#rground)"/>
      {/* Perspective sol */}
      <path d="M0,65 Q50,62 100,65 Q150,62 200,65" fill="#68c828" opacity="0.5"/>
      {/* Chemin perspective */}
      <path d="M82,118 L88,65 L112,65 L118,118" fill="url(#rpath2)"/>
      <line x1={100} y1={118} x2={100} y2={65} stroke="#c8b860" strokeWidth={1} strokeDasharray="6,4" opacity="0.5"/>
      {/* Herbes hautes gauche */}
      {[[15,65],[22,63],[30,66],[8,64],[38,65]].map(([hx,hy],i)=>(
        <g key={i}>
          <path d={`M${hx},${hy} Q${hx-4},${hy-14} ${hx-2},${hy-20}`} stroke="#2d8a14" strokeWidth={2} fill="none"/>
          <path d={`M${hx},${hy} Q${hx+2},${hy-12} ${hx+4},${hy-18}`} stroke="#3aaa1e" strokeWidth={2} fill="none"/>
          <path d={`M${hx},${hy} Q${hx-1},${hy-10} ${hx+1},${hy-16}`} stroke="#48c026" strokeWidth={1.5} fill="none"/>
        </g>
      ))}
      {/* Herbes hautes droite */}
      {[[160,65],[168,63],[176,66],[152,64],[183,65]].map(([hx,hy],i)=>(
        <g key={i}>
          <path d={`M${hx},${hy} Q${hx-3},${hy-13} ${hx-1},${hy-19}`} stroke="#2d8a14" strokeWidth={2} fill="none"/>
          <path d={`M${hx},${hy} Q${hx+3},${hy-11} ${hx+5},${hy-17}`} stroke="#3aaa1e" strokeWidth={2} fill="none"/>
        </g>
      ))}
      {/* Fleurs */}
      {[[45,66,"#ff9f9f"],[55,64,"#ffffff"],[145,66,"#ffe082"],[138,64,"#b3e5fc"]].map(([fx,fy,fc],i)=>(
        <g key={i}><circle cx={fx} cy={fy} r={2.5} fill={fc} opacity={0.9}/><circle cx={fx} cy={fy} r={1} fill="#fff8"/></g>
      ))}
      {/* Panneau */}
      <rect x={72} y={48} width={18} height={12} fill="#d4a860" rx={1}/>
      <rect x={80} y={60} width={2.5} height={8} fill="#8b5a20"/>
      <text x={81} y={57} fontSize={4} fill="#5a3010" textAnchor="middle" fontWeight="bold">→</text>
    </svg>
  );

  const Forest=()=>(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1a0a"/><stop offset="100%" stopColor="#1a3a1a"/>
        </linearGradient>
        <radialGradient id="fglow" cx="50%" cy="40%" r="40%">
          <stop offset="0%" stopColor="#a5d6a7" stopOpacity="0.15"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="fground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b5e20"/><stop offset="100%" stopColor="#0d3a10"/>
        </linearGradient>
        <filter id="ftreeglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width={W} height={H} fill="url(#fsky)"/>
      <rect width={W} height={H} fill="url(#fglow)"/>
      {/* Brume de fond */}
      <ellipse cx={100} cy={90} rx={100} ry={30} fill="#2d5e20" opacity="0.4"/>
      {/* Arbres fond (petits, loin) */}
      {[[20,68,18,14],[60,62,22,16],[105,60,20,14],[150,62,22,16],[185,68,18,14]].map(([tx,ty,rw,rh],i)=>(
        <g key={"bf"+i} opacity="0.5">
          <rect x={tx-2} y={ty} width={4} height={20} fill="#1b3a10"/>
          <ellipse cx={tx} cy={ty} rx={rw} ry={rh} fill="#1b5e20"/>
        </g>
      ))}
      {/* Sol */}
      <rect x={0} y={80} width={W} height={H-80} fill="url(#fground)"/>
      {/* Racines et sol */}
      <path d="M0,80 Q30,76 60,80 Q90,77 120,80 Q150,76 180,80 L200,80" fill="#245e1a" opacity="0.5"/>
      {/* Chemin */}
      <path d="M88,118 L93,80 L107,80 L112,118" fill="#1a4010" opacity="0.7"/>
      {/* Grands arbres premier plan */}
      {[[25,82,20,24],[80,76,24,28],[140,76,24,28],[178,82,20,24]].map(([tx,ty,rw,rh],i)=>(
        <g key={"ft"+i} filter="url(#ftreeglow)">
          <rect x={tx-3} y={ty+rh*0.6} width={6} height={H-ty-rh*0.6+2} fill="#3e2723"/>
          <ellipse cx={tx} cy={ty+rh*0.3} rx={rw} ry={rh} fill={i%2===0?"#1b5e20":"#2e7d32"}/>
          <ellipse cx={tx-rw*0.3} cy={ty} rx={rw*0.7} ry={rh*0.7} fill={i%2===0?"#2e7d32":"#388e3c"}/>
          <ellipse cx={tx+rw*0.2} cy={ty-rh*0.2} rx={rw*0.5} ry={rh*0.5} fill="#43a047" opacity="0.8"/>
          {/* Reflet lumière */}
          <ellipse cx={tx-rw*0.2} cy={ty-rh*0.1} rx={rw*0.25} ry={rh*0.2} fill="#81c784" opacity="0.3"/>
        </g>
      ))}
      {/* Lucioles */}
      {[[50,50,0.9],[90,42,0.7],[130,55,0.85],[160,45,0.6],[75,65,0.75],[125,60,0.8]].map(([lx,ly,op],i)=>(
        <g key={i}>
          <circle cx={lx} cy={ly} r={1.8} fill="#e8f5e9" opacity={op}/>
          <circle cx={lx} cy={ly} r={4} fill="#c8e6c9" opacity={op*0.3}/>
        </g>
      ))}
      {/* Champignons */}
      {[[35,82,"#e53935"],[165,82,"#ff7043"]].map(([mx,my,mc],i)=>(
        <g key={i}>
          <rect x={mx-1.5} y={my-6} width={3} height={7} fill="#f5deb3"/>
          <ellipse cx={mx} cy={my-6} rx={6} ry={4} fill={mc}/>
          {[...Array(3)].map((_,j)=><circle key={j} cx={mx-4+j*3} cy={my-7} r={1} fill="white" opacity="0.7"/>)}
        </g>
      ))}
      {/* Brume sol */}
      <rect x={0} y={95} width={W} height={23} fill="url(#fsky)" opacity="0.25"/>
    </svg>
  );

  const Cave=()=>(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <linearGradient id="csky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#08080f"/><stop offset="100%" stopColor="#10101e"/>
        </linearGradient>
        <radialGradient id="ctorch" cx="50%" cy="55%" r="45%">
          <stop offset="0%" stopColor="#ff9800" stopOpacity="0.25"/><stop offset="60%" stopColor="#ff5722" stopOpacity="0.1"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="ccrystal1" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/><stop offset="100%" stopColor="#4fc3f7" stopOpacity="0.2"/>
        </radialGradient>
        <filter id="cglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width={W} height={H} fill="url(#csky)"/>
      <rect width={W} height={H} fill="url(#ctorch)"/>
      {/* Paroi du fond */}
      <path d="M0,0 L0,118 L200,118 L200,0 Q160,15 130,8 Q100,2 70,10 Q40,18 0,0" fill="#14142a"/>
      {/* Stalactites */}
      {[[20,0,8,28],[45,0,6,20],[80,0,10,35],[115,0,7,24],[148,0,9,30],[175,0,6,18],[195,0,5,15]].map(([sx,sy,sw,sl],i)=>(
        <g key={i}>
          <polygon points={`${sx-sw},${sy} ${sx+sw},${sy} ${sx},${sy+sl}`} fill="#1a1a30"/>
          <polygon points={`${sx-sw},${sy} ${sx},${sy} ${sx},${sy+sl}`} fill="#22223a" opacity="0.5"/>
          {/* Gouttes */}
          <ellipse cx={sx} cy={sy+sl+2} rx={1.5} ry={2} fill="#4a6080" opacity="0.6"/>
        </g>
      ))}
      {/* Sol rocheux */}
      <path d="M0,90 Q15,85 30,90 Q50,84 70,90 Q90,86 110,90 Q130,84 150,90 Q170,85 190,90 L200,90 L200,118 L0,118" fill="#1a1a2e"/>
      {/* Stalagmites */}
      {[[15,118,5,18],[55,118,6,22],[95,118,4,14],[135,118,7,25],[175,118,5,16]].map(([sx,sy,sw,sl],i)=>(
        <polygon key={i} points={`${sx-sw},${sy} ${sx+sw},${sy} ${sx},${sy-sl}`} fill="#22223a"/>
      ))}
      {/* Cristaux */}
      {[[40,72,["#4fc3f7","#29b6f6","#b3e5fc"]],[100,65,["#ce93d8","#ab47bc","#f3e5f5"]],[160,70,["#80cbc4","#26a69a","#e0f2f1"]]].map(([kx,ky,clrs],i)=>(
        <g key={i} filter="url(#cglow)">
          {[[-8,0,12,24],[-3,-5,8,20],[4,-3,9,22],[10,2,7,18]].map(([dx,dy,w,h2],j)=>(
            <g key={j}>
              <polygon points={`${kx+dx},${ky+dy} ${kx+dx+w/2},${ky+dy+h2} ${kx+dx-w/2},${ky+dy+h2}`} fill={clrs[j%3]} opacity="0.85"/>
              <polygon points={`${kx+dx},${ky+dy} ${kx+dx+w/2},${ky+dy+h2} ${kx+dx},${ky+dy+h2*0.4}`} fill="white" opacity="0.3"/>
            </g>
          ))}
          <ellipse cx={kx} cy={ky+20} rx={14} ry={5} fill={clrs[0]} opacity="0.15"/>
        </g>
      ))}
      {/* Torche */}
      <rect x={98} y={52} width={4} height={12} fill="#5d4037"/>
      <ellipse cx={100} cy={52} rx={5} ry={7} fill="#ff9800" opacity="0.9" filter="url(#cglow)"/>
      <ellipse cx={100} cy={48} rx={3} ry={5} fill="#ffeb3b" opacity="0.8"/>
      <ellipse cx={100} cy={46} rx={2} ry={3} fill="white" opacity="0.6"/>
      {/* Eau au fond */}
      <ellipse cx={100} cy={115} rx={60} ry={5} fill="#1565c0" opacity="0.4"/>
      <ellipse cx={100} cy={115} rx={45} ry={3} fill="#1976d2" opacity="0.3"/>
    </svg>
  );

  const City=()=>(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <linearGradient id="ctsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1565c0"/><stop offset="60%" stopColor="#42a5f5"/><stop offset="100%" stopColor="#80c8f0"/>
        </linearGradient>
        <linearGradient id="ctground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#757575"/><stop offset="100%" stopColor="#424242"/>
        </linearGradient>
        <filter id="ctshadow"><feDropShadow dx="3" dy="3" stdDeviation="3" floodOpacity="0.5"/></filter>
      </defs>
      <rect width={W} height={H} fill="url(#ctsky)"/>
      {/* Nuages */}
      <g opacity="0.8"><ellipse cx={30} cy={20} rx={20} ry={8} fill="white"/><ellipse cx={44} cy={15} rx={16} ry={10} fill="white"/><ellipse cx={55} cy={20} rx={13} ry={7} fill="#f0f8ff"/></g>
      {/* Bâtiment arrière gauche */}
      <rect x={5} y={30} width={35} height={58} fill="#546e7a"/>
      {[...Array(4)].map((_,i)=>[...Array(3)].map((_2,j)=>(
        <rect key={`w${i}${j}`} x={10+j*10} y={35+i*12} width={6} height={8} fill={(i+j)%3===0?"#37474f":"#ffe082"} rx={0.5} opacity="0.9"/>
      )))}
      {/* Bâtiment arrière droite */}
      <rect x={155} y={22} width={40} height={66} fill="#4a5568"/>
      {[...Array(5)].map((_,i)=>[...Array(3)].map((_2,j)=>(
        <rect key={`wr${i}${j}`} x={160+j*11} y={28+i*11} width={7} height={7} fill={i===1&&j===1?"#ff8f00":"#ffe082"} rx={0.5} opacity="0.85"/>
      )))}
      {/* Bâtiment central grand */}
      <g filter="url(#ctshadow)">
        <rect x={55} y={18} width={90} height={70} fill="#607d8b"/>
        <rect x={55} y={18} width={90} height={6} fill="#78909c"/>
        <rect x={55} y={18} width={90} height={2} fill="#90a4ae"/>
        {/* Fenêtres grille */}
        {[...Array(4)].map((_,i)=>[...Array(5)].map((_2,j)=>(
          <rect key={`wc${i}${j}`} x={62+j*16} y={28+i*14} width={10} height={9} fill={i===0&&j===2?"#ff6f00":i===2&&j===4?"#76ff03":"#ffe082"} rx={0.5} opacity="0.9"/>
        )))}
        {/* Entrée */}
        <rect x={88} y={70} width={24} height={18} fill="#37474f"/>
        <rect x={90} y={70} width={10} height={18} fill="#2d3e4a"/>
        <rect x={100} y={70} width={10} height={18} fill="#263238"/>
        {/* Auvent */}
        <rect x={82} y={68} width={36} height={4} fill="#4caf50"/>
      </g>
      {/* Sol */}
      <rect x={0} y={88} width={W} height={H-88} fill="url(#ctground)"/>
      {/* Lignes route */}
      <line x1={0} y1={100} x2={W} y2={100} stroke="#9e9e9e" strokeWidth={0.5}/>
      {[20,60,100,140,180].map((lx,i)=><line key={i} x1={lx} y1={88} x2={lx+12} y2={88} stroke="#ffd600" strokeWidth={1.5}/>)}
      {/* Lampadaire */}
      <rect x={135} y={55} width={2.5} height={35} fill="#424242"/>
      <path d="M136,55 Q148,50 148,58" fill="none" stroke="#424242" strokeWidth={2}/>
      <ellipse cx={148} cy={58} rx={4} ry={2.5} fill="#fff59d" opacity="0.9"/>
      <ellipse cx={148} cy={58} rx={8} ry={5} fill="#fff59d" opacity="0.15"/>
    </svg>
  );

  const Volcano=()=>(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <linearGradient id="vsky2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0300"/><stop offset="50%" stopColor="#3d0b00"/><stop offset="100%" stopColor="#6d1b00"/>
        </linearGradient>
        <radialGradient id="lavalight" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#ff6d00" stopOpacity="0.5"/><stop offset="70%" stopColor="#bf360c" stopOpacity="0.2"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="lavag" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e64a19"/><stop offset="50%" stopColor="#ff6d00"/><stop offset="100%" stopColor="#e64a19"/>
        </linearGradient>
        <filter id="ffiregl"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width={W} height={H} fill="url(#vsky2)"/>
      <rect width={W} height={H} fill="url(#lavalight)"/>
      {/* Volcan */}
      <polygon points="0,118 60,118 100,18 140,118 200,118" fill="#3e1a0a"/>
      <polygon points="60,118 100,18 140,118" fill="#4a2010"/>
      {/* Côtés ombre */}
      <polygon points="60,118 100,18 68,118" fill="#2a0e06" opacity="0.5"/>
      {/* Cratère */}
      <ellipse cx={100} cy={20} rx={22} ry={8} fill="#1a0800"/>
      <ellipse cx={100} cy={20} rx={18} ry={6} fill="#ff3d00" opacity="0.7" filter="url(#ffiregl)"/>
      {/* Lave qui coule */}
      <path d="M88,20 Q84,40 82,60 Q80,75 85,90 Q88,100 90,118" stroke="#ff6d00" strokeWidth={5} fill="none" opacity="0.8" strokeLinecap="round"/>
      <path d="M112,20 Q116,45 118,65 Q119,80 115,95 Q112,108 110,118" stroke="#ff3d00" strokeWidth={4} fill="none" opacity="0.7" strokeLinecap="round"/>
      {/* Rochers */}
      <ellipse cx={30} cy={100} rx={20} ry={10} fill="#2a1208"/>
      <ellipse cx={170} cy={95} rx={22} ry={12} fill="#2a1208"/>
      <ellipse cx={60} cy={108} rx={14} ry={7} fill="#3a1a0a"/>
      {/* Lave sol */}
      <path d="M0,105 Q50,95 100,105 Q150,95 200,105 L200,118 L0,118" fill="url(#lavag)"/>
      {/* Étincelles / flammes */}
      {[[90,15],[100,10],[110,14],[95,8],[105,12]].map(([fx,fy],i)=>(
        <g key={i} filter="url(#ffiregl)">
          <circle cx={fx+([-2,1,3,-1,2][i]||0)} cy={fy} r={2} fill="#ffeb3b" opacity="0.9"/>
          <circle cx={fx} cy={fy-4} r={1} fill="white" opacity="0.7"/>
        </g>
      ))}
      {/* Fumée */}
      {[[95,8],[100,2],[106,6]].map(([sx,sy],i)=>(
        <ellipse key={i} cx={sx} cy={sy} rx={10+i*5} ry={6+i*3} fill="#424242" opacity={0.3-i*0.08}/>
      ))}
    </svg>
  );

  const Elite=()=>(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <linearGradient id="esky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050510"/><stop offset="100%" stopColor="#0d0820"/>
        </linearGradient>
        <radialGradient id="eglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6a1b9a" stopOpacity="0.4"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="emarble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0a30"/><stop offset="100%" stopColor="#0d0520"/>
        </linearGradient>
        <filter id="egoldglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width={W} height={H} fill="url(#esky)"/>
      <rect width={W} height={H} fill="url(#eglow)"/>
      {/* Étoiles */}
      {[[10,8],[30,5],[55,12],[80,4],[120,7],[145,3],[170,9],[190,6],[25,20],[165,18],[50,25],[140,22]].map(([sx,sy],i)=>(
        <circle key={i} cx={sx} cy={sy} r={i%3===0?1.5:1} fill="white" opacity={0.4+Math.sin(i)*0.3}/>
      ))}
      {/* Sol marbre */}
      <rect x={0} y={72} width={W} height={H-72} fill="url(#emarble)"/>
      {/* Motif damier marbre */}
      {[...Array(10)].map((_,i)=>[...Array(3)].map((_2,j)=>(
        (i+j)%2===0&&<rect key={`m${i}${j}`} x={i*20} y={72+j*16} width={20} height={16} fill="#200840" opacity="0.5"/>
      )))}
      {/* Colonnes */}
      {[[20,20],[175,20]].map(([cx,ch],i)=>(
        <g key={i}>
          <rect x={cx-8} y={ch} width={16} height={54} fill="#1a0840"/>
          <rect x={cx-8} y={ch} width={16} height={54} stroke="#6a1b9a" strokeWidth={0.5} fill="none"/>
          {/* Cannelures */}
          {[...Array(5)].map((_,j)=><line key={j} x1={cx-6+j*3} y1={ch} x2={cx-6+j*3} y2={ch+54} stroke="#7b1fa2" strokeWidth={0.5} opacity="0.4"/>)}
          <rect x={cx-10} y={ch-4} width={20} height={6} fill="#4a1870" rx={1}/>
          <rect x={cx-10} y={ch+52} width={20} height={6} fill="#4a1870" rx={1}/>
        </g>
      ))}
      {/* Trophée */}
      <g filter="url(#egoldglow)">
        <rect x={91} y={45} width={18} height={28} fill="#b8860b"/>
        <rect x={87} y={70} width={26} height={4} fill="#daa520"/>
        <rect x={85} y={72} width={30} height={3} fill="#b8860b" rx={1}/>
        {/* Coupe */}
        <path d="M91,45 Q83,38 85,30 Q100,22 115,30 Q117,38 109,45" fill="#ffd700"/>
        <path d="M91,45 Q83,38 85,30 Q93,25 100,25" fill="#ffec80" opacity="0.4"/>
        <ellipse cx={100} cy={28} rx={14} ry={5} fill="#ffd700"/>
        <ellipse cx={100} cy={26} rx={12} ry={4} fill="#ffe57f"/>
        {/* Anses */}
        <path d="M86,38 Q78,35 78,42 Q78,48 86,46" fill="none" stroke="#daa520" strokeWidth={3}/>
        <path d="M114,38 Q122,35 122,42 Q122,48 114,46" fill="none" stroke="#daa520" strokeWidth={3}/>
        {/* Étoile */}
        <polygon points="100,30 101.5,34 105,34 102.5,36.5 103.5,40 100,38 96.5,40 97.5,36.5 95,34 98.5,34" fill="#fff176"/>
      </g>
      {/* Lumières */}
      {[[20,24],[180,24]].map(([lx,ly],i)=>(
        <ellipse key={i} cx={lx} cy={ly} rx={12} ry={8} fill="#9c27b0" opacity="0.2"/>
      ))}
    </svg>
  );

  const Portal=()=>(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <radialGradient id="portalbg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0040"/><stop offset="100%" stopColor="#04000f"/>
        </radialGradient>
        <radialGradient id="portalring" cx="50%" cy="50%" r="50%">
          <stop offset="20%" stopColor="transparent"/>
          <stop offset="55%" stopColor="#7b2fff" stopOpacity="0.9"/>
          <stop offset="65%" stopColor="#b388ff" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="portalinner" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a0060" stopOpacity="0.9"/>
          <stop offset="60%" stopColor="#0d0030" stopOpacity="0.95"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <filter id="pgl"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width={W} height={H} fill="url(#portalbg)"/>
      {/* Étoiles */}
      {[[15,10],[40,6],[70,14],[110,5],[150,8],[180,12],[30,30],[160,28],[90,40],[60,50],[145,45]].map(([sx,sy],i)=>(
        <circle key={i} cx={sx} cy={sy} r={i%4===0?2:1} fill="white" opacity={0.3+i*0.05}/>
      ))}
      {/* Sol */}
      <rect x={0} y={88} width={W} height={H-88} fill="#0d0025"/>
      {/* Reflet portail sol */}
      <ellipse cx={100} cy={95} rx={40} ry={8} fill="#6a0dad" opacity="0.15"/>
      {/* Portail externe */}
      <ellipse cx={100} cy={52} rx={48} ry={52} fill="url(#portalring)" filter="url(#pgl)"/>
      {/* Portail milieu */}
      <ellipse cx={100} cy={52} rx={35} ry={39} fill="url(#portalinner)"/>
      {/* Spirale intérieure */}
      {[0,60,120,180,240,300].map((a,i)=>(
        <ellipse key={i} cx={100+Math.cos(a*Math.PI/180)*12} cy={52+Math.sin(a*Math.PI/180)*12} rx={6} ry={8} fill="#b388ff" opacity="0.4" transform={`rotate(${a},100,52)`}/>
      ))}
      <ellipse cx={100} cy={52} rx={18} ry={20} fill="#6200ea" opacity="0.5"/>
      <ellipse cx={100} cy={52} rx={8} ry={9} fill="#b388ff" opacity="0.3"/>
      {/* Particules orbitant */}
      {[0,72,144,216,288].map((a,i)=>{
        const px=100+Math.cos(a*Math.PI/180)*44;
        const py=52+Math.sin(a*Math.PI/180)*48;
        return <g key={i} filter="url(#pgl)">
          <circle cx={px} cy={py} r={3} fill={["#ce93d8","#80deea","#fff9c4","#f48fb1","#c5e1a5"][i]} opacity="0.9"/>
        </g>;
      })}
    </svg>
  );

  const Lab=()=>(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:"block"}}>
      <defs>
        <linearGradient id="labsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3f2fd"/><stop offset="100%" stopColor="#bbdefb"/>
        </linearGradient>
        <linearGradient id="labwall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fafafa"/><stop offset="100%" stopColor="#eeeeee"/>
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#labsky)"/>
      {/* Mur */}
      <rect x={0} y={35} width={W} height={H-35} fill="url(#labwall)"/>
      {/* Plinthes */}
      <rect x={0} y={35} width={W} height={3} fill="#e0e0e0"/>
      {/* Paillasse gauche */}
      <rect x={5} y={55} width={75} height={40} fill="#c8e6c9" rx={2}/>
      <rect x={5} y={55} width={75} height={5} fill="#a5d6a7"/>
      {/* Équipements gauche */}
      <rect x={15} y={35} width={18} height={22} fill="#b0bec5" rx={1}/>
      <rect x={17} y={37} width={14} height={16} fill="#eceff1" rx={1}/>
      <text x={24} y={49} fontSize={10} textAnchor="middle">📊</text>
      <rect x={40} y={38} width={12} height={19} fill="#80cbc4" rx={6} opacity="0.8"/>
      <ellipse cx={46} cy={38} rx={5} ry={3} fill="#4db6ac" opacity="0.9"/>
      {/* Fiole avec liquide */}
      <rect x={60} y={45} width={8} height={14} fill="#b3e5fc" rx={1} opacity="0.7"/>
      <rect x={60} y={53} width={8} height={6} fill="#29b6f6" opacity="0.8"/>
      <rect x={59} y={43} width={10} height={3} fill="#78909c" rx={1}/>
      {/* Paillasse droite */}
      <rect x={120} y={60} width={75} height={35} fill="#fce4ec" rx={2}/>
      <rect x={120} y={60} width={75} height={5} fill="#f48fb1"/>
      {/* PC */}
      <rect x={128} y={38} width={28} height={24} fill="#424242" rx={2}/>
      <rect x={130} y={40} width={24} height={18} fill="#00e676" rx={1} opacity="0.8"/>
      <text x={142} y={52} fontSize={9} textAnchor="middle">💻</text>
      <rect x={136} y={62} width={12} height={2} fill="#616161" rx={1}/>
      {/* Pokéball sur paillasse */}
      <circle cx={172} cy={57} r={8} fill="#ef5350"/>
      <rect x={164} y={56} width={16} height={2} fill="#212121"/>
      <circle cx={172} cy={57} r={8} fill="none" stroke="#212121" strokeWidth={1}/>
      <circle cx={172} cy={57} r={3} fill="white"/>
      <circle cx={172} cy={57} r={2} fill="#e0e0e0"/>
      {/* Sol */}
      <rect x={0} y={95} width={W} height={H-95} fill="#e8f5e9"/>
      {[0,20,40,60,80,100,120,140,160,180].map((lx,i)=>(
        <line key={i} x1={lx} y1={95} x2={lx} y2={H} stroke="#c8e6c9" strokeWidth={0.5}/>
      ))}
    </svg>
  );

  const comps={village:Village,route:Route,forest:Forest,cave:Cave,city:City,volcano:Volcano,elite:Elite,portal:Portal,lab:Lab};
  const Comp=comps[theme]||comps.route;
  return(
    <div style={{position:"relative",width:"100%",height:118,overflow:"hidden",borderRadius:14,border:"3px solid #2f5fa8",flexShrink:0,boxShadow:"0 5px 0 rgba(47,95,168,0.18),0 12px 24px rgba(23,54,91,0.22)",background:"#ffffff"}}>
      <Comp/>
      <div style={{position:"absolute",inset:0,boxShadow:"inset 0 0 0 3px rgba(255,255,255,0.35)",pointerEvents:"none"}}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  REGION MAP — Carte style RPG premium
// ═══════════════════════════════════════════════════════════════════
function KantoMap({current,onSelect,region="Kanto"}){
  const THEME_CLR={
    city:"#5b9bd5",route:"#68a84a",forest:"#2d6e2d",cave:"#6b4f35",
    volcano:"#c62828",elite:"#6a1b9a",lab:"#2e7d32",village:"#d4a017",portal:"#6a0dad"
  };
  const TILE_BG={
    city:"#3d5a80",route:"#4a7a30",forest:"#1b4d1b",cave:"#3e2a1a",
    volcano:"#7f1a1a",elite:"#2d0a4e",lab:"#1a4d1a",village:"#7a5c10",portal:"#2d0060"
  };

  const regionZones=Object.entries(ZONES).filter(([,d])=>d.region===region);
  const roads=[];
  regionZones.forEach(([name,d])=>{
    (d.connects||[]).forEach(c=>{
      if(ZONES[c]?.region===region&&!roads.some(r=>(r[0]===c&&r[1]===name))){roads.push([name,c]);}
    });
  });

  const SCALE=20;
  const OX=90, OY=48;
  const isoP=(mx,my)=>({x:OX+(mx-my)*SCALE, y:OY+(mx+my)*SCALE*0.48});
  const SVG_W=260, SVG_H=185;
  const S=SCALE*0.85;

  // Trier les zones par y pour le painter's algorithm
  const sorted=[...regionZones].sort(([,a],[,b])=>(a.mapX+a.mapY)-(b.mapX+b.mapY));

  return(
    <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{background:"#060d06",borderRadius:6,border:"1px solid #1a3a1a",cursor:"pointer",maxHeight:185,display:"block",boxShadow:"0 4px 20px rgba(0,0,0,0.8)"}}>
      <defs>
        <filter id="mapglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="mapglow2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        {/* Texture parchemin */}
        <pattern id="mapgrid" width="20" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="20" y2="0" stroke="#0f1f0f" strokeWidth="0.3"/>
          <line x1="0" y1="0" x2="0" y2="10" stroke="#0f1f0f" strokeWidth="0.3"/>
        </pattern>
      </defs>

      {/* Fond texture */}
      <rect width={SVG_W} height={SVG_H} fill="#060d06"/>
      <rect width={SVG_W} height={SVG_H} fill="url(#mapgrid)" opacity="0.4"/>

      {/* Routes d'abord (dessous) */}
      {roads.map(([a,b],i)=>{
        const pa=isoP(ZONES[a].mapX,ZONES[a].mapY);
        const pb=isoP(ZONES[b].mapX,ZONES[b].mapY);
        const mx=(pa.x+pb.x)/2, my=(pa.y+pb.y)/2;
        return <g key={i}>
          <line x1={pa.x} y1={pa.y+S*0.45} x2={pb.x} y2={pb.y+S*0.45} stroke="#1a3a1a" strokeWidth={4} strokeLinecap="round"/>
          <line x1={pa.x} y1={pa.y+S*0.45} x2={pb.x} y2={pb.y+S*0.45} stroke="#2d5a2d" strokeWidth={2} strokeLinecap="round" strokeDasharray="6,4"/>
          <line x1={pa.x} y1={pa.y+S*0.45} x2={pb.x} y2={pb.y+S*0.45} stroke="#3a7a3a" strokeWidth={0.8} strokeLinecap="round" opacity="0.5"/>
        </g>;
      })}

      {/* Tuiles iso avec volume */}
      {sorted.map(([name,d])=>{
        const{x,y}=isoP(d.mapX,d.mapY);
        const clr=THEME_CLR[d.theme]||"#555";
        const bg=TILE_BG[d.theme]||"#222";
        const isCur=name===current;
        const TH={city:10,elite:12,volcano:9,lab:5,village:6,cave:4,forest:3,route:1,portal:8}[d.theme]||3;
        const top=[[x,y-TH],[x+S,y+S*0.48-TH],[x,y+S*0.96-TH],[x-S,y+S*0.48-TH]].map(p=>p.join(",")).join(" ");
        const left=[[x-S,y+S*0.48-TH],[x,y+S*0.96-TH],[x,y+S*0.96],[x-S,y+S*0.48]].map(p=>p.join(",")).join(" ");
        const right=[[x+S,y+S*0.48-TH],[x,y+S*0.96-TH],[x,y+S*0.96],[x+S,y+S*0.48]].map(p=>p.join(",")).join(" ");
        return <g key={name}>
          <polygon points={left} fill={bg} opacity="0.95" stroke="#0005" strokeWidth="0.3"/>
          <polygon points={right} fill={bg} opacity="0.7" stroke="#0005" strokeWidth="0.3"/>
          <polygon points={top} fill={isCur?clr:bg} opacity={isCur?1:0.88} stroke={isCur?"#d9a441":"#0008"} strokeWidth={isCur?1:"0.3"}/>
          {/* Texture sur la tuile */}
          {!isCur&&<polygon points={top} fill={clr} opacity="0.35"/>}
        </g>;
      })}

      {/* Points et labels des zones */}
      {regionZones.map(([name,d])=>{
        const{x,y}=isoP(d.mapX,d.mapY);
        const isCur=name===current;
        const clr=THEME_CLR[d.theme]||"#555";
        const TH={city:10,elite:12,volcano:9,lab:5,village:6,cave:4,forest:3,route:1,portal:8}[d.theme]||3;
        const cy2=y+S*0.48-TH;
        return(
          <g key={name+"dot"} onClick={()=>onSelect(name)} style={{cursor:"pointer"}}>
            {isCur&&<>
              <circle cx={x} cy={cy2} r={16} fill={clr} opacity="0.12" filter="url(#mapglow2)"/>
              <circle cx={x} cy={cy2} r={11} fill={clr} opacity="0.2" filter="url(#mapglow)"/>
            </>}
            {/* Icône de zone */}
            <circle cx={x} cy={cy2} r={isCur?5.5:4} fill={isCur?"#d9a441":clr} stroke={isCur?"#fff":"#111"} strokeWidth={isCur?1.5:0.8} filter={isCur?"url(#mapglow)":""}/>
            {isCur&&<>
              <circle cx={x} cy={cy2} r={8} fill="none" stroke="#d9a441" strokeWidth={1} opacity="0.55"/>
              <circle cx={x} cy={cy2} r={12} fill="none" stroke="#d9a441" strokeWidth={0.5} opacity="0.25"/>
            </>}
            {/* Label */}
            <text x={x} y={cy2-9} textAnchor="middle" fontSize={isCur?5:4} fill={isCur?"#d9a441":"#8fc88f"} fontWeight={isCur?"bold":"normal"} stroke="#000" strokeWidth={isCur?"0.8":"0.5"} paintOrder="stroke" letterSpacing="0.2">
              {name.length>15?name.slice(0,14)+"…":name}
            </text>
          </g>
        );
      })}

      {/* Boussole */}
      <g opacity="0.6">
        <circle cx={SVG_W-14} cy={14} r={9} fill="#0d1a0d" stroke="#2d5a2d" strokeWidth={0.8}/>
        <polygon points={`${SVG_W-14},6 ${SVG_W-12},13 ${SVG_W-16},13`} fill="#ef5350"/>
        <polygon points={`${SVG_W-14},22 ${SVG_W-12},15 ${SVG_W-16},15`} fill="#f5f5f5"/>
        <text x={SVG_W-14} y={10} textAnchor="middle" fontSize={4} fill="#ef5350" fontWeight="bold">N</text>
      </g>

      {/* Légende */}
      <text x={4} y={SVG_H-3} fontSize={4.5} fill="#4a7a4a" fontFamily="monospace">{region} — Tapez pour voyager</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  REGION MAP — Carte isométrique 3D
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
//  RANDOM ENCOUNTER — vraiment aléatoire sur tout le Pokédex
// ═══════════════════════════════════════════════════════════════════
function makeEncounter(zd){
  const pool=PKM;
  const minLvl=zd.min||2;
  const maxLvl=zd.max||10;
  const picked=pool[Math.floor(Math.random()*pool.length)];
  const baseLvl=Math.floor(Math.random()*(maxLvl-minLvl+1))+minLvl;
  const lvl=Math.max(2,baseLvl);
  const shiny=Math.random()<1/128;
  return{picked,lvl,shiny};
}

// ═══════════════════════════════════════════════════════════════════
//  PROCESS ACTION (narrative engine) — intention stricte
// ═══════════════════════════════════════════════════════════════════
function processAction(action,gs){
  const p=gs.players[0];
  const loc=p.location||gs.location||"Bourg Palette";
  const zd=ZONES[loc]||{connects:[],wild:[],min:3,max:8,pkCenter:false,shop:false,gym:null,theme:"route",desc:""};
  const al=action.toLowerCase();
  const other=gs.players.length>1?gs.players.slice(1).map(pl=>pl.name).join(" et "):null;

  // ── 1. CENTRE POKÉMON → soin garanti ──────────────────────────
  if(al.includes("centre")||al.includes("soign")||al.includes("infirmière")||al.includes("center")){
    if(!zd.pkCenter){
      const nearest=(zd.connects||[]).find(c=>ZONES[c]?.pkCenter)||"une ville voisine";
      return{text:`Il n'y a pas de Centre Pokémon à ${loc}. Le plus proche est à **${nearest}**.`,
        choices:[`Aller à ${nearest}`,"Explorer","Regarder mon équipe"]};
    }
    return{text:`Tu pousses la porte du Centre Pokémon. Infirmière Joëlle t'accueille avec son sourire chaleureux :\n"Bienvenue ! Nous allons prendre soin de vos Pokémon !"\n\nQuelques secondes plus tard — tous vos Pokémon sont soignés et leurs PP restaurés.`,
      heal:true,choices:zoneChoices(zd,p)};
  }

  // ── 2. MAGASIN → ouverture boutique garantie ──────────────────
  if(al.includes("magasin")||al.includes("shop")||al.includes("acheter")||al.includes("boutique")){
    if(!zd.shop){
      const nearest=(zd.connects||[]).find(c=>ZONES[c]?.shop)||"une ville voisine";
      return{text:`Pas de magasin ici. Le plus proche est à **${nearest}**.`,
        choices:[`Aller à ${nearest}`,"Explorer"]};
    }
    return{text:`Tu entres dans le Magasin Pokémon. Les rayons sont bien garnis !\nLe vendeur te salue : "Bienvenue ! Que puis-je faire pour vous ?"`,
      openShop:true,choices:["Regarder les articles"]};
  }

  // ── 3. ARÈNE → combat d'arène garanti ─────────────────────────
  if(al.includes("arène")||al.includes("gym")||al.includes("défi")||al.includes("badge")||al.includes("champion d'arène")){
    if(!zd.gym){
      const nearest=(zd.connects||[]).find(c=>ZONES[c]?.gym)||"plus loin";
      return{text:`Il n'y a pas d'Arène à ${loc}. La prochaine se trouve à **${nearest}**.`,
        choices:[`Aller à ${nearest}`,"Explorer","Chercher des Pokémon"]};
    }
    const g=zd.gym;
    if(p.badges.includes(g.badge)){
      return{text:`Tu as déjà le badge de ${loc} ! ${g.leader} te salue :\n"Tu l'as bien mérité. Va conquérir les autres arènes !"`,
        choices:["Se déplacer","Explorer","Chercher des Pokémon"]};
    }
    const teamAvg=p.team.filter(pk=>pk.hp>0).reduce((a,pk)=>a+pk.level,0)/Math.max(1,p.team.filter(pk=>pk.hp>0).length);
    if(teamAvg<g.lvl-8){
      return{text:`Tu te présentes à l'Arène de ${loc}. ${g.leader} t'observe de loin et secoue la tête :\n"Tu es courageux(se), mais pas encore prêt(e). Mon équipe est autour du niveau ${g.lvl}. Entraîne-toi davantage et reviens !"`,
        choices:["Chercher des Pokémon","Se déplacer",...(zd.pkCenter?["Centre Pokémon"]:[])]};
    }
    return{text:`🏟️ Tu entres dans l'Arène de ${loc} !\n${g.leader} te fait face, les bras croisés, les yeux brillants.\n"Je t'attendais, dresseur. Montre-moi la force de ton équipe !"`,
      gymFight:g,choices:["Accepter le défi !","Rebrousser chemin"]};
  }

  // ── 4. DÉPLACEMENT → voyage garanti vers la destination ───────
  const normalizedAction=norm(al);
  const destMatch=zd.connects?.find(c=>normalizedAction.includes(norm(c)))||zd.connects?.find(c=>al.includes(c.toLowerCase()));
  if(destMatch||al.includes("aller à")||al.includes("voyager vers")||al.includes("partir vers")||al.includes("se déplacer")||al.includes("direction")){
    const dest=destMatch||zd.connects?.find(c=>normalizedAction.includes(norm(c)))||zd.connects?.[0];
    if(!dest){
      return{text:`Les chemins depuis ${loc} : ${(zd.connects||["aucun"]).join(", ")}.`,
        choices:(zd.connects||[]).map(c=>`Aller à ${c}`).concat(["Explorer la zone"])};
    }
    // Portail inter-région ?
    const portal=REGION_PORTALS[dest];
    if(portal){
      const totalBadges=p.badges.length;
      if(totalBadges<portal.minBadges){
        return{text:`⛔ Le portail vers **${regionLabel(portal.region)}** est verrouillé.\n\nIl te faut au moins **${portal.minBadges} badges** pour voyager entre régions.\nTu en as **${totalBadges}** pour l'instant. Continue ton aventure !`,
          choices:["Explorer la zone","Chercher des Pokémon",...(zd.gym&&!p.badges.includes(zd.gym.badge)?["Défier l'Arène"]:[]),"Retourner en arrière"]};
      }
      const nd=ZONES[portal.dest]||{};
      return{text:`🌀 Le portail s'ouvre dans un tourbillon de lumière !\n\nTu traverses les dimensions et atterris dans **${portal.dest}**, au cœur de la région **${regionLabel(portal.region)}** !\n\n${nd.desc||""}\n\nUne nouvelle aventure commence !`,
        travel:portal.dest,regionTravel:portal.region,
        choices:zoneChoices(nd,p).concat(["Regarder mon équipe"]).slice(0,5)};
    }
    const nd=ZONES[dest]||{};
    const travelText=`Tu quittes **${loc}** et pars vers **${dest}**.\n${nd.desc||""}\n\nAprès quelques minutes de marche, tu arrives à destination.`;
    const destChoices=zoneChoices(nd,p);
    return{text:travelText,travel:dest,choices:destChoices.length?destChoices:["Explorer","Chercher des Pokémon"]};
  }

  // ── 5. CHERCHER DES POKÉMON → rencontre garantie à 100% ───────
  if(al.includes("chercher")||al.includes("pokémon sauvage")||al.includes("herbes")||al.includes("dans les herbes")||al.includes("trouver un pokémon")||al.includes("capturer")||al.includes("chasser")){
    const{picked,lvl,shiny}=makeEncounter(zd);
    return{
      text:`Tu t'avances lentement dans les herbes hautes de ${loc}, l'œil aux aguets…\n\n${shiny?"✨":picked.leg?"🌟":"⚡"} Un <strong>${shiny?"SHINY ":""}${picked.n}</strong> sauvage de niveau <strong>${lvl}</strong> surgit !${picked.leg?" — Légendaire !":""}`,
      encounter:{id:picked.id,lvl,shiny},
      choices:["Combattre !","Lancer une Poké Ball","Fuir en courant"]
    };
  }

  // ── 6. EXPLORER → événement narratif + POSSIBILITÉ de rencontre
  if(al.includes("explorer")||al.includes("regarder")||al.includes("observer")||al.includes("examiner")||al.includes("fouiller")){
    const ev=getEvent(loc,p.name,other);
    // 50% chance d'une rencontre en bonus après l'événement
    if(Math.random()<0.5){
      const{picked,lvl,shiny}=makeEncounter(zd);
      return{text:ev+`\n\nPendant ton exploration, un <strong>${shiny?"SHINY ":""}${picked.n}</strong> (Nv.${lvl}) surgit des buissons !${picked.leg?" — Légendaire !":""}`,
        encounter:{id:picked.id,lvl,shiny},choices:["Combattre !","Lancer une Poké Ball","Fuir"]};
    }
    const foundItem=Math.random()<0.20?"potion":null;
    return{text:ev+(foundItem?"\n\n*Tu trouves une Potion par terre !*":""),foundItem,
      choices:["Chercher des Pokémon","Explorer davantage","Se déplacer",...(zd.gym&&!p.badges.includes(zd.gym?.badge)?["Défier l'Arène"]:[]),...(zd.pkCenter?["Centre Pokémon"]:[])]};
  }

  // ── 7. PARLER / INTERAGIR → PNJ garanti, pas de rencontre ─────
  if(al.includes("parler")||al.includes("interagir")||al.includes("pnj")||al.includes("dresseur")||al.includes("professeur")||al.includes("discuter")){
    const ev=getEvent(loc,p.name,other);
    return{text:ev,choices:["Explorer la zone","Chercher des Pokémon","Se déplacer",...(zd.gym&&!p.badges.includes(zd.gym?.badge)?["Défier l'Arène"]:[]),...(zd.pkCenter?["Centre Pokémon"]:[])]};
  }

  // ── 8. ÉQUIPE / PC / POKÉDEX → info garantie, pas d'événement ─
  if(al.includes("équipe")||al.includes("mes pokémon")||al.includes("voir mon équipe")||al.includes("pokédex")){
    const team=p.team.map(pk=>`• **${pk.name}** Nv.${pk.level} — ${pk.hp}/${pk.maxhp}PV${pk.hp<=0?" *(K.O.)*":""}`).join("\n");
    return{text:`📊 **Équipe de ${p.name} :**\n${team}\n\n*PC : ${p.pc.length} Pokémon stockés — Pokédex : ${p.dex.length} capturés*`,
      choices:["Ouvrir le PC","Centre Pokémon","Chercher des Pokémon","Se déplacer"]};
  }

  // ── 9. TEAM ROCKET / COMBAT FORCÉ ─────────────────────────────
  if(al.includes("rocket")||al.includes("attaquer")||al.includes("provoquer")){
    const rIds=[19,20,41,42,52,92,93];
    const rid=rIds[Math.floor(Math.random()*rIds.length)];
    const rlvl=Math.max(5,Math.min((p.team[0]?.level||5)+ri(-2,4),55));
    return{text:`Un agent de la Team Rocket surgit de nulle part !\n"Pour la Team Rocket ! Tu ne passeras pas !"`,
      encounter:{id:rid,lvl:rlvl,isTrainer:true,tName:"Agent Rocket"},choices:["Combattre !"]};
  }

  // ── 10. CONTINUER / ACTION NEUTRE → rencontre garantie ────────
  if(al.includes("continuer")||al.includes("avancer")||al.includes("poursuivre")){
    const{picked,lvl,shiny}=makeEncounter(zd);
    return{text:`Tu continues ton chemin à travers ${loc}…\n\n${shiny?"✨":picked.leg?"🌟":"⚡"} Un <strong>${shiny?"SHINY ":""}${picked.n}</strong> sauvage (Nv.${lvl}) te barre la route !${picked.leg?" — Légendaire !":""}`,
      encounter:{id:picked.id,lvl,shiny},choices:["Combattre !","Lancer une Poké Ball","Fuir"]};
  }

  // ── 11. DEFAULT → événement narratif avec menu clair ──────────
  const ev=getEvent(loc,p.name,other);
  return{text:ev,
    choices:[
      "Chercher des Pokémon",
      "Explorer la zone",
      "Parler à quelqu'un",
      ...((zd.connects||[]).slice(0,2).map(c=>`Aller à ${c}`)),
      ...(zd.gym&&!p.badges.includes(zd.gym?.badge)?["Défier l'Arène"]:[]),
      ...(zd.pkCenter?["Centre Pokémon"]:[]),
    ].slice(0,5)
  };
}


// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
const STARTERS=[
  {id:1,n:"Bulbizarre",t:"Plante/Poison",region:"Kanto"},
  {id:4,n:"Salamèche",t:"Feu",region:"Kanto"},
  {id:7,n:"Carapuce",t:"Eau",region:"Kanto"},
];
export default function App({
  initialGameState=null,
  myPlayerIdx: myPlayerIdxProp=0,
  playerName="",
  roomId="",
  onGameStateChange=null,
  onForceSync=null,
  onNewGame=null,
  onBackToLobby=null
}){
  const [screen,setScreen]=useState(initialGameState?"game":"title");
  const [pName,setPName]=useState("");
  const [sIdx,setSIdx]=useState(0);
  const [extras,setExtras]=useState([]);
  const [gs,setGs]=useState(()=>initialGameState?ensurePlayableState(initialGameState,myPlayerIdxProp,playerName):null);
  const [msgs,setMsgs]=useState([]);
  const [choices,setChoices]=useState(initialGameState?["Continuer l'aventure","Explorer la zone","Centre Pokémon","Regarder l'équipe"]:[]);
  const [inp,setInp]=useState("");
  const [combat,setCombat]=useState(null);
  const [showPC,setShowPC]=useState(false);
  const [showShop,setShowShop]=useState(false);
  const [showMap,setShowMap]=useState(false);
  const [tab,setTab]=useState("players");
  const [pcSelT,setPcSelT]=useState(-1);
  const [pcSelP,setPcSelP]=useState(-1);
  const [notif,setNotif]=useState(null);
  const [showAddPlayer,setShowAddPlayer]=useState(false);
  const [showQuitConfirm,setShowQuitConfirm]=useState(false);
  const [newPlayerName,setNewPlayerName]=useState("");
  const [newPlayerStarter,setNewPlayerStarter]=useState(STARTERS[0].id);
  const narRef=useRef(null);

  // Sync avec le serveur quand initialGameState change (autre joueur a joué)
  useEffect(()=>{
    if(initialGameState&&!combat){
      const normalized=ensurePlayableState(initialGameState,myPlayerIdxProp,playerName);
      if(JSON.stringify(normalized)!==JSON.stringify(initialGameState)&&onGameStateChange){
        onGameStateChange(normalized,"Joueur synchronisé");
      }
      setGs(prev=>{
        // Ne pas écraser si on est en combat local
        if(JSON.stringify(prev)===JSON.stringify(normalized)) return prev;
        return normalized;
      });
      setCurPIdx(Math.min(normalized.activePlayerIdx||0, Math.max(0,(normalized.players?.length||1)-1)));
      if(screen==="title") setScreen("game");
    }
  },[initialGameState, combat, myPlayerIdxProp, playerName, screen, onGameStateChange]);

  useEffect(()=>{if(narRef.current)narRef.current.scrollTop=narRef.current.scrollHeight;},[msgs]);

  const notify=useCallback((m,ms=3000)=>{setNotif(m);setTimeout(()=>setNotif(null),ms);},[]);
  const addMsg=useCallback((type,label,content)=>{
    setMsgs(prev=>{
      const last=prev[prev.length-1];
      if(last&&last.type===type&&last.content===content) return prev;
      return [...prev,{id:Date.now()+Math.random(),type,label,content}];
    });
  },[]);

  // save: envoie au serveur via socket + localStorage fallback
  const save=useCallback((state,silent=false)=>{
    try{localStorage.setItem("pkwv4",JSON.stringify({gs:state,ts:Date.now()}));}catch(e){}
    if(onGameStateChange) onGameStateChange(state);
    if(!silent)notify("💾 Sauvegardé !");
  },[notify,onGameStateChange]);

  const load=()=>{try{const r=localStorage.getItem("pkwv4");if(!r){notify("❌ Aucune sauvegarde !");return;}const{gs:s}=JSON.parse(r);const normalized=ensurePlayableState(s,0,pName||playerName||"Dresseur");setGs(normalized);setMyPlayerIdx(0);setCurPIdx(normalized?.activePlayerIdx||0);setScreen("game");setChoices(["Continuer l'aventure","Explorer la zone","Centre Pokémon","Regarder l'équipe"]);addMsg("system","💾","Partie chargée ! Bienvenue de retour.");}catch(e){notify("❌ Erreur chargement");}};

  const [myPlayerIdx, setMyPlayerIdx] = useState(myPlayerIdxProp);
  const [selectedRegion, setSelectedRegion] = useState("Kanto");
  const regionStarterList = REGIONS[selectedRegion]?.starters || STARTERS;

  // current player index (whose turn it is)
  const [curPIdx, setCurPIdx] = useState(0);

  useEffect(()=>{setMyPlayerIdx(myPlayerIdxProp);},[myPlayerIdxProp]);

  // advance turn to next player
  const nextPlayer = useCallback((state, afterIdx) => {
    const n = state.players.length;
    if(n <= 1) return 0;
    return (afterIdx + 1) % n;
  }, []);

  // start
  const startGame=()=>{
    const name=pName.trim()||"Dresseur";
    const sid=regionStarterList[sIdx]?.id||1;
    const players=[makePlayer(name,sid,true,selectedRegion)];
    extras.forEach(ep=>{if(ep.name?.trim())players.push(makePlayer(ep.name.trim(),ep.sid||regionStarterList[0].id,false,selectedRegion));});
    const startLoc=players[0].location;
    const state={players,location:startLoc,turn:0,activePlayerIdx:0};
    setGs(state);setMsgs([]);setScreen("game");setCurPIdx(0);setMyPlayerIdx(0);
    const st=gp(sid);
    const multiStr=players.length>1?`\n\n*${players.slice(1).map(p=>p.name).join(" et ")} t'accompagne${players.length>2?"nt":""} dans cette aventure ! Les joueurs joueront chacun à leur tour.*`:"";
    addMsg("narrator","🎮 MAÎTRE DU JEU",`Bienvenue dans le monde des Pokémon, **${name}** !\n\nTu te tiens devant chez toi à **${startLoc}**, au cœur de la région **${regionLabel(selectedRegion)}**. Dans ta main, la Poké Ball de ton premier partenaire : **${st.n}**, niveau 5.${multiStr}\n\nUne grande aventure t'attend. Que fais-tu ?`);
    setChoices(["Explorer ma ville de départ","Partir à l'aventure","Chercher des Pokémon","Parler à un habitant"]);
    try{localStorage.setItem("pkwv4",JSON.stringify({gs:state,ts:Date.now()}));}catch(e){}
    if(onNewGame) onNewGame(state); else save(state,true);
  };

  // action handler — now player-aware
  const doAction=useCallback((action, state, pIdx)=>{
    if(!state)return;
    const pidx = pIdx ?? 0;
    const curPlayer = state.players[pidx] || state.players[0];

    // Build a view of the state from this player's perspective
    // (swap player to index 0 position for processAction which always reads players[0])
    const gsForAction = JSON.parse(JSON.stringify(state));
    if(pidx !== 0){
      // temporarily swap so processAction sees the right player as [0]
      [gsForAction.players[0], gsForAction.players[pidx]] = [gsForAction.players[pidx], gsForAction.players[0]];
      gsForAction.location = curPlayer.location;
    }

    const resp = processAction(action, gsForAction);
    let newGs = JSON.parse(JSON.stringify(state));
    newGs.turn = (newGs.turn||0)+1;

    addMsg("narrator","🎮 MAÎTRE DU JEU", resp.text.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>"));

    if(resp.heal){
      newGs.players[pidx].team.forEach(pk=>{pk.hp=pk.maxhp;pk.status=null;pk.moves.forEach(m=>m.pp=m.maxpp);});
      // pas de addMsg ici — resp.text dit déjà que l'équipe est soignée
      notify("✅ Équipe soignée !");
    }
    if(resp.travel){
      newGs.players[pidx].location = resp.travel;
      if(resp.regionTravel) newGs.players[pidx].region = resp.regionTravel;
      const allSame = newGs.players.every(p=>p.location===resp.travel);
      if(allSame) newGs.location = resp.travel;
      else newGs.location = newGs.players[0].location;
    }
    if(resp.foundItem){
      newGs.players[pidx].inventory.potion=(newGs.players[pidx].inventory.potion||0)+1;
      // pas de addMsg ici — resp.text mentionne déjà l'objet trouvé
      notify(`🎁 Potion trouvée !`);
    }
    if(resp.openShop) setShowShop(true);

    if(resp.encounter){
      const{id,lvl,isTrainer,tName,shiny=false}=resp.encounter;
      const pk=gp(id); const emhp=calcHP(pk.hp,lvl);
      const lead=newGs.players[pidx].team.find(p=>p.hp>0);
      if(lead){
        setCombat({
          enemy:{id,name:pk.n,types:pk.t,level:lvl,hp:emhp,maxhp:emhp,moves:toMoveSlots(learnableMoveNames(pk,lvl)),status:null,leg:!!pk.leg,shiny:!!shiny},
          ally:lead, gs:newGs, turn:1,
          log:isTrainer?`${tName} envoie ${pk.n} (Nv.${lvl}) !`:`Un ${shiny?"SHINY ":""}${pk.n} sauvage (Nv.${lvl}) apparaît !`,
          isTrainer:!!isTrainer, tName:tName||"", active:true,
          ownerPIdx: pidx  // which player is in this combat
        });
        setGs(newGs); save(newGs,true); return;
      }
    }
    if(resp.gymFight){
      const g=resp.gymFight;
      const pkId=g.pkmIds?.[0]||19; const pk=gp(pkId); const emhp=calcHP(pk.hp,g.lvl);
      const lead=newGs.players[pidx].team.find(p=>p.hp>0);
      if(lead){
        setCombat({
          enemy:{id:pkId,name:pk.n,types:pk.t,level:g.lvl,hp:emhp,maxhp:emhp,moves:toMoveSlots(learnableMoveNames(pk,g.lvl)),status:null,leg:false},
          ally:lead, gs:newGs, turn:1,
          log:`${g.leader} envoie ${pk.n} (Nv.${g.lvl}) !`,
          isTrainer:true, tName:g.leader, isGym:true, gymBadge:g.badge, gymReward:g.reward, active:true,
          ownerPIdx: pidx
        });
        setGs(newGs); save(newGs,true); return;
      }
    }

    // Advance to next player's turn
    const next = nextPlayer(newGs, pidx);
    newGs.activePlayerIdx = next;
    setCurPIdx(next);
    if(newGs.players.length > 1){
      addMsg("system","🔄 TOUR",`C'est maintenant au tour de <strong>${newGs.players[next].name}</strong> !`);
    }
    setGs(newGs);
    setChoices(resp.choices||["Explorer","Se déplacer","Équipe","Centre Pokémon"]);
    save(newGs,true);
  },[addMsg,notify,save,nextPlayer]);

  const send=()=>{
    if(!inp.trim()||!gs)return;
    const t=inp.trim(); setInp(""); setChoices([]);
    const cp=gs.players[curPIdx]||gs.players[0];
    addMsg("player",`▶ ${cp.name.toUpperCase()}`,t);
    doAction(t,gs,curPIdx);
  };
  const pick=(c)=>{
    setChoices([]);
    const cp=gs?.players[curPIdx]||gs?.players[0];
    addMsg("player",`▶ ${cp?.name?.toUpperCase()||""}`,c);
    doAction(c,gs,curPIdx);
  };

  // COMBAT — dégâts basés sur la puissance de l'attaque
  const calcDmg=(atkerPkm, atkerLvl, defPkm, defLvl, moveName)=>{
    const mdata=MOVES_DB[moveName]||{pow:40,cat:"phy"};
    if(mdata.pow===0) return 0; // attaque de statut → pas de dégâts
    const pow=Math.min(mdata.pow, movePowerCap(atkerLvl));
    const atkStat = mdata.cat==="spe"
      ? Math.floor((atkerPkm.atk*2*atkerLvl)/100+5)   // Attaque Spéciale (même formule simplifiée)
      : Math.floor((atkerPkm.atk*2*atkerLvl)/100+5);   // Attaque Physique
    const defStat = Math.floor((defPkm.def*2*defLvl)/100+5);
    const base = Math.floor(((2*atkerLvl/5+2)*pow*atkStat/defStat)/50+2);
    const variance = ri(85,100)/100;
    const raw=Math.max(1, Math.floor(base*variance));
    const targetMaxHp=calcHP(defPkm.hp,defLvl);
    if(atkerLvl<=defLvl-10) return Math.min(raw, Math.max(1,Math.floor(targetMaxHp*0.28)));
    if(atkerLvl<=defLvl-4) return Math.min(raw, Math.max(1,Math.floor(targetMaxHp*0.38)));
    return Math.min(raw, Math.max(1,Math.floor(targetMaxHp*0.72)));
  };

  const applyStatusMove=(moveName, target, log)=>{
    const mdata=MOVES_DB[moveName]||{};
    const eff=mdata.eff||"";
    let msg=log;
    if(eff==="sleep")   msg+=` ${target.name} s'est endormi !`;
    if(eff==="def-1")   msg+=` La Défense de ${target.name} a baissé !`;
    if(eff==="def+1")   msg+=` La Défense de ${target.name} a augmenté !`;
    if(eff==="def+2")   msg+=` La Défense de ${target.name} a fortement augmenté !`;
    if(eff==="spa+2")   msg+=` ${target.name} se concentre !`;
    if(eff==="acc-1")   msg+=` La Précision de ${target.name} a baissé !`;
    if(eff==="heal")    { target.hp=Math.min(target.maxhp,target.hp+Math.floor(target.maxhp/2)); msg+=` ${target.name} récupère des PV !`; }
    if(eff==="flee")    msg+=` ${target.name} a fui !`;
    return msg;
  };

  const doMove=(mv,cmb)=>{
    if(!cmb?.active)return;
    mv.pp=Math.max(0,mv.pp-1);
    const a=cmb.ally, e=cmb.enemy;
    const aPkm=gp(a.id), ePkm=gp(e.id);
    const mdata=MOVES_DB[mv.name]||{pow:40,cat:"phy"};

    if(mdata.pow===0){
      // Attaque de statut
      let log=`${a.name} utilise <b>${mv.name}</b> !`;
      log=applyStatusMove(mv.name, e, log);
      setCombat({...cmb,log,turn:cmb.turn+1});
      setTimeout(()=>eTurn({...cmb,turn:cmb.turn+1}),800);
      return;
    }

    const dmg=calcDmg(aPkm,a.level,ePkm,e.level,mv.name);
    e.hp=Math.max(0,e.hp-dmg);
    const log=`${a.name} utilise <b>${mv.name}</b> → <span style="color:#b8872f">${dmg} dégâts</span> !`;
    if(e.hp<=0){endVic({...cmb,enemy:e,log});return;}
    setCombat({...cmb,enemy:e,log,turn:cmb.turn+1});
    setTimeout(()=>eTurn({...cmb,enemy:e,turn:cmb.turn+1}),800);
  };

  const eTurn=(cmb)=>{
    if(!cmb?.active)return;
    const e=cmb.enemy, a=cmb.ally;
    const ePkm=gp(e.id), aPkm=gp(a.id);

    // L'ennemi préfère les attaques offensives
    const offMoves=e.moves.filter(mv=>{const md=MOVES_DB[mv.name];return md&&md.pow>0&&mv.pp>0;});
    const mv=offMoves.length>0
      ? offMoves[Math.floor(Math.random()*offMoves.length)]
      : (e.moves.find(mv=>mv.pp>0)||{name:"Charge"});

    const mdata=MOVES_DB[mv.name]||{pow:40,cat:"phy"};
    let log;

    if(mdata.pow===0){
      log=`${e.name} utilise <b>${mv.name}</b> !`;
    } else {
      let dmg=calcDmg(ePkm,e.level,aPkm,a.level,mv.name);
      a.hp=Math.max(0,a.hp-dmg);
      log=`${e.name} utilise <b>${mv.name}</b> → <span style="color:#b85d4f">${dmg} dégâts</span> à ${a.name} !`;
    }

    if(a.hp<=0){
      const pidx=cmb.ownerPIdx??0;
      const next=cmb.gs.players[pidx].team.find(p=>p.uid!==a.uid&&p.hp>0);
      if(!next){endLoss({...cmb,ally:a,log});return;}
      setCombat({...cmb,ally:next,log:`${a.name} est K.O. ! <b>Allez ${next.name} !</b>`,turn:cmb.turn+1});
      return;
    }
    setCombat({...cmb,ally:a,log,turn:cmb.turn+1});
  };

  const tryCatch=(cmb)=>{
    if(cmb.isTrainer){setCombat({...cmb,log:"❌ Impossible de capturer le Pokémon d'un dresseur !"});return;}
    const pidxC=cmb.ownerPIdx??0;
    const p=cmb.gs.players[pidxC]||cmb.gs.players[0];
    const e=cmb.enemy;
    let bid="pokeball",rate=1.2;
    if(p.inventory.masterball>0){bid="masterball";rate=999;}
    else if(p.inventory.hyperball>0){bid="hyperball";rate=3.5;}
    else if(p.inventory.superball>0){bid="superball";rate=2;}
    else if(!p.inventory.pokeball||p.inventory.pokeball<=0){setCombat({...cmb,log:"❌ Plus de Poké Balls !"});return;}
    const gsN=JSON.parse(JSON.stringify(cmb.gs));
    gsN.players[pidxC].inventory[bid]=Math.max(0,(gsN.players[pidxC].inventory[bid]||1)-1);
    // GENEROUS capture formula
    const hpRatio=e.hp/e.maxhp;
    const baseRate=e.leg?30:80; // very generous
    const chance=Math.min(0.97,(baseRate*rate*(1.2-hpRatio))/100);
    const caught=rate>=999||Math.random()<chance;
    if(caught){
      const newPk=normalizeOwnedPkm({uid:`${Date.now()}${Math.random()}`,id:e.id,name:e.name,types:e.types,level:e.level,exp:0,expN:calcXPN(e.level+1),hp:e.hp,maxhp:e.maxhp,moves:e.moves,status:null,leg:e.leg,shiny:!!e.shiny});
      const pidxC=cmb.ownerPIdx??0;
      if(gsN.players[pidxC].team.length<6)gsN.players[pidxC].team.push(newPk);else gsN.players[pidxC].pc.push(newPk);
      if(!gsN.players[pidxC].dex.includes(e.id))gsN.players[pidxC].dex.push(e.id);
      addMsg("system","🎉",`<b>${e.shiny?"SHINY ":""}${e.name}</b> capturé par ${gsN.players[pidxC].name} !`);
      notify(`🎉 ${e.shiny?"SHINY ":""}${e.name} capturé !`);
      setTimeout(()=>endVic({...cmb,gs:gsN}),600);
    }else{
      setCombat({...cmb,gs:gsN,log:`${e.name} résiste ! ${(Math.random()>0.5?"Il secoue frénétiquement la Ball...":"La Ball s'ouvre d'un coup !")}`});
      setTimeout(()=>eTurn({...cmb,gs:gsN}),700);
    }
  };

  const endVic=(cmb)=>{
    setCombat(null);
    const pidx=cmb.ownerPIdx??0;
    const gsN=JSON.parse(JSON.stringify(cmb.gs||gs));
    const e=cmb.enemy;
    const xp=Math.floor(e.level*55*(e.leg?4:1));
    const money=ri(100,300)*e.level*(cmb.isTrainer?1:0.3)|0;
    const lvlMsgs=omniXP(gsN.players,xp,cmb.ally.uid,pidx);
    gsN.players[pidx].money+=money;
    let badgeMsg="";
    if(cmb.isGym&&!gsN.players[pidx].badges.includes(cmb.gymBadge)){
      gsN.players[pidx].badges.push(cmb.gymBadge);
      gsN.players[pidx].money+=cmb.gymReward||0;
      const regionBadges=REGION_BADGES[gsN.players[pidx].region||"Kanto"]||[];
      const badgeEmoji=regionBadges[cmb.gymBadge]||"🏅";
      badgeMsg=`\n🏅 <b>Badge ${badgeEmoji} obtenu !</b> +${cmb.gymReward||0}₽`;
    }
    addMsg("system","🏆 VICTOIRE",`+${xp} XP (partagés) · +${money}₽${badgeMsg}`);
    lvlMsgs.forEach(m=>{addMsg("system",m.type==="evo"?"✨":"⬆️",m.text);notify(m.text,2500);});
    closeCombat(gsN,pidx);
  };

  const endLoss=(cmb)=>{
    setCombat(null);
    const pidx=cmb.ownerPIdx??0;
    const gsN=JSON.parse(JSON.stringify(cmb.gs||gs));
    const loser=gsN.players[pidx];
    loser.money=Math.floor(loser.money*0.85);
    loser.team.forEach(pk=>{pk.hp=Math.max(1,Math.floor(pk.maxhp*0.1));pk.status=null;});
    addMsg("system","💀 DÉFAITE",`Tous les Pokémon de <b>${loser.name}</b> sont K.O. ! Téléportés au Centre Pokémon le plus proche…`);
    setTimeout(()=>{
      const gsN2=JSON.parse(JSON.stringify(gsN));
      const loser2=gsN2.players[pidx];
      // Soigner uniquement le joueur qui a perdu
      loser2.team.forEach(pk=>{pk.hp=pk.maxhp;pk.moves.forEach(m=>m.pp=m.maxpp);});
      // Téléporter ce joueur au Centre Pokémon le plus proche (même région)
      const currentLoc=loser2.location||gsN2.location;
      const currentRegion=loser2.region||ZONES[currentLoc]?.region||"Kanto";
      // 1. La zone actuelle a-t-elle un Centre ?
      let nearestCenter=ZONES[currentLoc]?.pkCenter ? currentLoc : null;
      // 2. Chercher dans les connexions directes de même région
      if(!nearestCenter){
        const connects=ZONES[currentLoc]?.connects||[];
        nearestCenter=connects.find(z=>ZONES[z]?.pkCenter&&ZONES[z]?.region===currentRegion)||null;
      }
      // 3. Chercher dans toutes les zones de même région
      if(!nearestCenter){
        nearestCenter=Object.keys(ZONES).find(z=>ZONES[z].pkCenter&&ZONES[z].region===currentRegion)||null;
      }
      // 4. Fallback absolu
      if(!nearestCenter) nearestCenter=currentLoc;
      loser2.location=nearestCenter;
      closeCombat(gsN2,pidx);
      addMsg("narrator","🎮 MAÎTRE DU JEU",`Infirmière Joëlle accueille <b>${loser2.name}</b> au Centre Pokémon de ${nearestCenter} avec son sourire chaleureux :\n<em>"Ne vous inquiétez pas — vos Pokémon vont beaucoup mieux maintenant !"</em>`);
    },2000);
  };

  const closeCombat=(gsN,pidx)=>{
    setCombat(null);
    setTimeout(()=>setCombat(null),0);
    const s=gsN||gs;
    const safePidx=Math.min(pidx??0,(s||gs)?.players?.length-1||0);
    const next=nextPlayer(s||gs||{players:[{name:""}]}, safePidx);
    if(s) s.activePlayerIdx=next;
    if(s){
      setGs({...s});
      try{localStorage.setItem("pkwv4",JSON.stringify({gs:s,ts:Date.now()}));}catch(e){}
      if(onForceSync) onForceSync(s); else save(s,true);
    }
    setCurPIdx(next);
    setChoices(["Continuer l'exploration","Chercher des Pokémon","Mon équipe","Se déplacer","Centre Pokémon"]);
    if((s||gs)?.players?.length>1){
      addMsg("system","🔄 TOUR",`C'est maintenant au tour de <strong>${(s||gs).players[next]?.name||"?"}</strong> !`);
    }
  };
  const flee=(cmb)=>{if(Math.random()>0.3){addMsg("system","🏃","Tu fuis !");closeCombat(cmb.gs,cmb.ownerPIdx??0);}else{setCombat({...cmb,log:"Impossible de fuir !"});setTimeout(()=>eTurn(cmb),600);}};

  // PC — toujours sur MON joueur (myPlayerIdx)
  const swapPk=()=>{
    if(!gs)return;const s=JSON.parse(JSON.stringify(gs));const p=s.players[myPlayerIdx]||s.players[0];
    if(pcSelT>=0&&pcSelP>=0){const tmp=p.team[pcSelT];p.team[pcSelT]=p.pc[pcSelP];p.pc[pcSelP]=tmp;notify(`↔ ${p.team[pcSelT].name} rejoint l'équipe de ${p.name} !`);}
    else if(pcSelT>=0){if(p.team.length<=1){notify("⚠️ Équipe vide !");return;}const pk=p.team.splice(pcSelT,1)[0];p.pc.push(pk);notify(`📦 ${pk.name} au PC de ${p.name} !`);}
    else if(pcSelP>=0&&p.team.length<6){const pk=p.pc.splice(pcSelP,1)[0];p.team.push(pk);notify(`✅ ${pk.name} dans l'équipe de ${p.name} !`);}
    else if(pcSelP>=0){notify("⚠️ Équipe pleine !");return;}
    setPcSelT(-1);setPcSelP(-1);setGs(s);save(s,true);
  };
  const useItem=(itemId)=>{
    if(!gs)return;const item=ITEMS_DB.find(i=>i.id===itemId);
    const s=JSON.parse(JSON.stringify(gs));const p=s.players[myPlayerIdx]||s.players[0];
    if(!item||!p.inventory[itemId]||p.inventory[itemId]<=0){notify("Plus de "+item?.n+"!");return;}
    if(item.type==="heal"){const t=p.team.find(pk=>pk.hp>0&&pk.hp<pk.maxhp)||p.team.find(pk=>pk.hp<pk.maxhp);if(!t){notify("PV pleins !");return;}const old=t.hp;t.hp=Math.min(t.maxhp,t.hp+item.heal);p.inventory[itemId]--;notify(`${item.e} +${t.hp-old}PV pour ${t.name} !`);}
    else if(item.type==="revive"){const f=p.team.find(pk=>pk.hp<=0);if(!f){notify("Aucun K.O. !");return;}f.hp=Math.floor(f.maxhp*0.5);p.inventory[itemId]--;notify(`💫 ${f.name} revenu !`);}
    else{p.inventory[itemId]--;notify(`${item.e} utilisé !`);}
    setGs(s);save(s,true);
  };
  const buyItem=(itemId)=>{
    if(!gs)return;const item=ITEMS_DB.find(i=>i.id===itemId);
    const s=JSON.parse(JSON.stringify(gs));const p=s.players[myPlayerIdx]||s.players[0];
    if(!item||p.money<item.p){notify("💸 Pas assez d'argent !");return;}
    p.money-=item.p;p.inventory[itemId]=(p.inventory[itemId]||0)+1;
    notify(`✅ ${item.e} ${item.n} acheté par ${p.name} !`);setGs(s);save(s,true);
  };
  const addMidPlayer=()=>setShowAddPlayer(true);
  const confirmAddMidPlayer=()=>{
    const name=newPlayerName.trim();
    if(!name){notify("Nom du joueur requis");return;}
    const s=JSON.parse(JSON.stringify(gs));
    const region=p?.region||s.players?.[0]?.region||"Kanto";
    s.players.push(makePlayer(name,newPlayerStarter,false,region));
    s.activePlayerIdx=curPIdx;
    setNewPlayerName("");
    setNewPlayerStarter(STARTERS[0].id);
    setShowAddPlayer(false);
    setGs(s);save(s,true);addMsg("system","👤",`${name} a rejoint l'aventure !`);notify(`👤 ${name} a rejoint !`);
  };

  const p=gs?.players?.[myPlayerIdx]||gs?.players?.[0];
  const pActive=gs?.players?.[curPIdx]||gs?.players?.[0];
  const isMyTurn = curPIdx === myPlayerIdx;
  const currentLoc = p?.location || gs?.location || "Bourg Palette";
  const zd=ZONES[currentLoc]||{connects:[],wild:[],min:3,max:8,pkCenter:false,shop:false,gym:null,theme:"route",desc:""};

  // ─── STYLES ─────────────────────────────────────────────
  const btn=(bg,col,bor,fs="9px",pad="8px 14px")=>({fontFamily:"'Press Start 2P',monospace",fontSize:fs,fontWeight:900,padding:pad,background:bg,border:`2px solid ${bor||col}`,color:col,cursor:"pointer",transition:"all 0.15s",letterSpacing:"0.5px",borderRadius:8,boxShadow:"inset 0 -3px rgba(0,0,0,0.16),0 3px 0 rgba(47,95,168,0.25)"});
  const ptitle={fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:C.border,letterSpacing:"2px",textTransform:"uppercase",paddingBottom:6,borderBottom:`2px solid rgba(47,95,168,0.18)`,marginBottom:8};
  const msgCol={narrator:C.acc,player:C.acc2,combat:C.red,system:C.green};
  const msgBg={narrator:"#f7efd9",player:"#eef2f6",combat:"#f3e5e2",system:"#e7f2e8"};
  const pokePageBg=DS_PAGE_BG;
  const panelCard={background:C.panel,border:`3px solid ${C.border}`,borderRadius:14,boxShadow:"0 8px 0 rgba(47,95,168,0.18),0 18px 34px rgba(23,54,91,0.22)"};

  // ═══ TITLE ════════════════════════════════════════════════════
  if(screen==="title")return(
    <div style={{minHeight:"100vh",background:pokePageBg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Press Start 2P',monospace",color:C.text,padding:20,textAlign:"center"}}>
      <style>@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');</style>
      <div style={{width:108,height:108,borderRadius:"50%",background:"linear-gradient(180deg,#b85d4f 0 47%,#24364f 47% 53%,#fbfaf4 53%)",border:"6px solid #24364f",boxShadow:"0 10px 0 rgba(36,54,79,0.14)",marginBottom:18,animation:"fl 3s ease-in-out infinite",position:"relative"}}>
        <div style={{position:"absolute",left:"50%",top:"50%",width:28,height:28,transform:"translate(-50%,-50%)",borderRadius:"50%",background:"#fff",border:"5px solid #1d2b53"}}/>
      </div>
      <div style={{fontSize:"clamp(18px,4vw,32px)",color:C.acc,textShadow:`2px 2px 0 rgba(79,103,146,0.42)`,marginBottom:10,letterSpacing:2}}>PokéWorld MMORPG</div>
      <div style={{fontSize:"clamp(7px,1.5vw,9px)",color:C.acc2,letterSpacing:3,marginBottom:10}}>GÉNÉRATIONS I-VI · SPRITES OFFICIELS</div>
      <div style={{fontSize:"7px",color:C.border,marginBottom:40,background:"rgba(255,255,255,0.72)",border:`2px solid ${C.border}`,borderRadius:999,padding:"8px 14px"}}>MÉGA-ÉVOLUTIONS · MULTIJOUEUR · IA MJ</div>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>setScreen("setup")} style={btn(C.acc,C.text,C.acc,"9px","12px 24px")}>▶ NOUVELLE PARTIE</button>
        <button onClick={load} style={btn("transparent",C.acc,C.acc,"9px","12px 24px")}>📂 CHARGER</button>
      </div>
      <style>{`@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>
    </div>
  );

  // ═══ SETUP ════════════════════════════════════════════════════
  if(screen==="setup")return(
    <div style={{minHeight:"100vh",background:pokePageBg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'Press Start 2P',monospace",color:C.text}}>
      <style>@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');</style>
      <div style={{...panelCard,padding:28,maxWidth:500,width:"100%"}}>
        <div style={{fontSize:12,color:C.acc,marginBottom:24,textAlign:"center"}}>⚔ CRÉER VOTRE DRESSEUR</div>
        <div style={{fontSize:"7px",color:C.dim,marginBottom:5}}>NOM</div>
        <input value={pName} onChange={e=>setPName(e.target.value)} placeholder="Sacha..." maxLength={12} onKeyDown={e=>e.key==="Enter"&&startGame()} style={{width:"100%",padding:"10px 12px",background:"#ffffff",border:`2px solid rgba(47,95,168,0.32)`,borderRadius:10,color:C.text,fontFamily:"'Press Start 2P',monospace",fontSize:11,outline:"none",marginBottom:18,boxSizing:"border-box"}}/>
        <div style={{fontSize:"7px",color:C.dim,marginBottom:8}}>RÉGION DE DÉPART</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:16}}>
          {Object.entries(REGIONS).map(([rName,rData])=>(
            <div key={rName} onClick={()=>{setSelectedRegion(rName);setSIdx(0);}} style={{background:selectedRegion===rName?`${rData.color}33`:"#ffffff",border:`2px solid ${selectedRegion===rName?rData.color:"rgba(47,95,168,0.24)"}`,borderRadius:10,padding:"7px 4px",textAlign:"center",cursor:"pointer",transition:"all 0.2s",boxShadow:selectedRegion===rName?"0 3px 0 rgba(0,0,0,0.12)":"none"}}>
              <div style={{fontSize:"7px",color:selectedRegion===rName?rData.color:C.dim,fontWeight:900,marginBottom:2}}>{regionLabel(rName)}</div>
              <div style={{fontSize:"6px",color:C.dim}}>{rData.totalBadges} badges</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:"7px",color:C.dim,marginBottom:10}}>STARTER POKÉMON</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
          {regionStarterList.map((s,i)=>(
            <div key={i} onClick={()=>setSIdx(i)} style={{background:sIdx===i?"#f4ead2":"#ffffff",border:`2px solid ${sIdx===i?C.acc:"rgba(82,111,143,0.24)"}`,borderRadius:12,padding:12,textAlign:"center",cursor:"pointer",transition:"all 0.2s",boxShadow:sIdx===i?"0 3px 0 rgba(36,54,79,0.12)":"none"}}>
              <img src={spriteUrl(s.id)} alt={s.n} style={{width:64,height:64,imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"}/>
              <div style={{fontSize:"7px",color:C.acc,marginTop:6}}>{s.n}</div>
              <div style={{fontSize:"6px",color:C.dim,marginTop:2}}>{s.t}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:"7px",color:C.dim,marginBottom:8}}>JOUEURS SUPPLÉMENTAIRES</div>
        {extras.map((ep,i)=>(
          <div key={i} style={{display:"flex",gap:5,marginBottom:6}}>
            <input placeholder={`Joueur ${i+2}`} maxLength={10} onChange={e=>setExtras(p=>{const n=[...p];n[i]={...n[i],name:e.target.value};return n;})} style={{flex:1,padding:"7px 9px",background:"#ffffff",border:`2px solid rgba(47,95,168,0.26)`,borderRadius:8,color:C.text,fontFamily:"'Press Start 2P',monospace",fontSize:9,outline:"none"}}/>
            <select onChange={e=>setExtras(p=>{const n=[...p];n[i]={...n[i],sid:parseInt(e.target.value)};return n;})} style={{padding:"7px 5px",background:"#ffffff",border:`2px solid rgba(47,95,168,0.26)`,borderRadius:8,color:C.text,fontFamily:"'Press Start 2P',monospace",fontSize:8}}>
              {regionStarterList.map((s,si)=><option key={si} value={s.id}>{s.n}</option>)}
            </select>
            <button onClick={()=>setExtras(p=>p.filter((_,j)=>j!==i))} style={btn(C.red,"white",C.red,"7px","5px 8px")}>✕</button>
          </div>
        ))}
        <button onClick={()=>setExtras(p=>[...p,{name:"",sid:1}])} style={{...btn("transparent",C.dim,C.border,"7px","7px 12px"),width:"100%",marginBottom:18}}>+ Ajouter joueur</button>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setScreen("title")} style={{...btn("transparent",C.acc,C.acc,"8px"),flex:1}}>← Retour</button>
          <button onClick={startGame} style={{...btn(C.acc,C.text,C.acc,"8px"),flex:2}}>🚀 COMMENCER !</button>
        </div>
      </div>
    </div>
  );

  // ═══ GAME ════════════════════════════════════════════════════
  return(
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"linear-gradient(180deg,#d5e5ee 0%,#f4f7f8 46%,#dcead1 100%)",color:C.text,fontFamily:"'Segoe UI',sans-serif",overflow:"hidden",fontSize:14}}>
      <style>@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');</style>

      {notif&&<div style={{position:"fixed",top:12,right:12,zIndex:999,background:C.panel,border:`1px solid ${C.acc}`,padding:"9px 14px",fontSize:12,maxWidth:260,boxShadow:`0 6px 24px rgba(36,54,79,0.18)`,fontFamily:"'Press Start 2P',monospace",animation:"sIn 0.3s ease",lineHeight:1.5}}>
        {notif}<style>{`@keyframes sIn{from{transform:translateX(110%)}to{transform:translateX(0)}}`}</style>
      </div>}

      {/* TOP BAR */}
      <div style={{background:"linear-gradient(180deg,#6f83a5 0%,#4f6792 100%)",borderBottom:`3px solid ${C.border}`,padding:"8px 12px",display:"flex",alignItems:"center",gap:10,flexShrink:0,flexWrap:"wrap",boxShadow:"0 3px 12px rgba(36,54,79,0.18)"}}>
        <span style={{fontFamily:"'Press Start 2P',monospace",fontSize:10,color:"#fff",textShadow:"1px 1px 0 rgba(36,54,79,0.65)"}}>⚡ PokéWorld</span>
        {p&&<div style={{background:"#ffffff",border:`2px solid ${C.border}`,borderRadius:999,padding:"5px 12px",display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontWeight:700,fontSize:13,fontFamily:"'Press Start 2P',monospace",fontSize:8}}>🎮 {p.name}</span>
          <span style={{color:C.acc,fontSize:11}}>💰 {p.money.toLocaleString()}₽</span>
          <span style={{color:C.dim,fontSize:11}}>🏅 {p.badges.length}/{REGIONS[p.region||"Kanto"]?.totalBadges||8}</span>
          <span style={{color:C.dim,fontSize:11}}>📍 {currentLoc}</span>
          <span style={{color:REGIONS[p.region||"Kanto"]?.color||C.acc2,fontSize:11}}>🌍 {regionLabel(p.region)}</span>
        </div>}
        {gs?.players.length>1&&<div style={{background:"rgba(217,164,65,0.14)",border:`2px solid ${C.acc}`,padding:"3px 12px",fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:C.acc,animation:"pulse 1.5s ease-in-out infinite"}}>
          🎯 TOUR : {gs.players[curPIdx]?.name||""}
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
        </div>}
        {/* Sélecteur d'identité — chaque joueur choisit qui il est */}
        {gs?.players.length>1&&<div style={{display:"flex",alignItems:"center",gap:6,background:C.bg,border:`1px solid ${C.border}`,padding:"3px 8px"}}>
          <span style={{fontSize:"7px",color:C.dim,fontFamily:"'Press Start 2P',monospace"}}>Je suis :</span>
          <select value={myPlayerIdx} onChange={e=>setMyPlayerIdx(parseInt(e.target.value))} style={{background:C.bg,border:`1px solid ${C.acc}`,color:C.acc,fontFamily:"'Press Start 2P',monospace",fontSize:"7px",padding:"2px 4px",cursor:"pointer"}}>
            {gs.players.map((pl,i)=><option key={i} value={i}>{pl.name}</option>)}
          </select>
        </div>}
        {gs?.players.slice(1).map((pl,i)=>(
          <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,padding:"3px 8px",fontSize:10,fontFamily:"'Press Start 2P',monospace",fontSize:7}}>👤 {pl.name}</div>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:5,flexWrap:"wrap"}}>
          <button onClick={()=>setShowMap(m=>!m)} style={btn("transparent",C.acc2,C.border,"7px","5px 9px")}>🗺️ Carte</button>
          <button onClick={()=>setShowPC(true)} style={btn("transparent",C.text,C.border,"7px","5px 9px")}>📦 PC</button>
          <button onClick={()=>setShowShop(true)} style={btn("transparent",C.text,C.border,"7px","5px 9px")}>🏪 Shop</button>
          <button onClick={addMidPlayer} style={btn("transparent",C.text,C.border,"7px","5px 9px")}>👤+</button>
          <button onClick={()=>save(gs)} style={btn("transparent",C.text,C.border,"7px","5px 9px")}>💾</button>
          <button onClick={()=>setShowQuitConfirm(true)} style={btn("transparent",C.red,C.red,"7px","5px 9px")}>✕</button>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* LEFT PANEL */}
        <div style={{width:214,flexShrink:0,background:"rgba(248,251,255,0.96)",borderRight:`3px solid ${C.border}`,overflow:"auto",padding:10,display:"flex",flexDirection:"column",gap:8,boxShadow:"inset -5px 0 rgba(47,95,168,0.08)"}}>
          {/* Zone scene */}
          <ZoneScene theme={zd.theme||"route"}/>
          <div style={{fontSize:"7px",color:C.acc,fontFamily:"'Press Start 2P',monospace",textAlign:"center",marginTop:2}}>{currentLoc}</div>
          <div style={{fontSize:9,color:C.dim,lineHeight:1.4,textAlign:"center",marginBottom:2}}>{zd.desc||""}</div>

          <div style={ptitle}>⚔ ÉQUIPE</div>
          {p?.team.map((pk,i)=>{
            const r=Math.max(0,pk.hp/pk.maxhp);
            return(
              <div key={pk.uid} style={{background:i===0?"#f7efd9":"#ffffff",border:`2px solid ${i===0?C.acc:"rgba(82,111,143,0.22)"}`,borderRadius:12,padding:8,cursor:"pointer",opacity:pk.hp<=0?0.35:1,boxShadow:"0 3px 0 rgba(36,54,79,0.10)"}} onClick={()=>addMsg("system","📊",`<b>${pk.name}</b> Nv.${pk.level} | ${pk.hp}/${pk.maxhp}PV<br>Types: ${(pk.types||[]).join(", ")}<br>Attaques: ${pk.moves.map(m=>m.name).join(", ")}`)}>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                  <img src={spriteUrl(pk.id,false,pk.shiny)} alt={pk.name} style={{width:32,height:32,imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"}/>
                  <div>
                    <div style={{fontSize:11,fontWeight:700}}>{pk.shiny?"✨ ":""}{pk.name}</div>
                    <div style={{fontSize:9,color:C.dim}}>Nv.{pk.level}</div>
                  </div>
                </div>
                <div style={{height:4,background:C.border,borderRadius:2}}><div style={{width:`${r*100}%`,height:"100%",background:hpCol(r),borderRadius:2,transition:"width 0.3s"}}/></div>
                <div style={{fontSize:9,color:C.dim,textAlign:"right"}}>{pk.hp}/{pk.maxhp}</div>
                <div style={{height:2,background:C.border,borderRadius:1,marginTop:1}}><div style={{width:`${Math.min(100,(pk.exp/pk.expN)*100)}%`,height:"100%",background:C.acc2,borderRadius:1,transition:"width 0.5s"}}/></div>
              </div>
            );
          })}

          <div style={{...ptitle,marginTop:4}}>📍 ZONE</div>
          <div style={{fontSize:11,color:C.acc}}>{p?.location||gs?.location}</div>
          <div style={{fontSize:9,color:C.dim,lineHeight:1.4,marginBottom:4}}>{ZONES[p?.location||gs?.location||""]?.desc||""}</div>
          <div style={{fontSize:9,color:REGIONS[p?.region||"Kanto"]?.color||C.acc2,fontFamily:"'Press Start 2P',monospace",marginBottom:6}}>🌍 {regionLabel(p?.region)}</div>

          <div style={{...ptitle,marginTop:2}}>🗺 CHEMINS</div>
          {(zd.connects||[]).map((c,i)=>{
            const isPortal=c.startsWith("⬡");
            const portal=REGION_PORTALS[c];
            const locked=isPortal&&(p?.badges?.length||0)<(portal?.minBadges||3);
            return(
              <button key={i} onClick={()=>!locked&&pick(`Aller à ${c}`)} style={{...btn("transparent",locked?C.dim:isPortal?C.acc2:C.dim,locked?C.border:isPortal?C.acc2:C.border,"7px","5px 8px"),textAlign:"left",width:"100%",marginBottom:2,opacity:locked?0.4:1,cursor:locked?"not-allowed":"pointer"}} title={locked?`${portal?.minBadges} badges requis`:""}>{isPortal?"🌀":"→"} {c}{locked?` (${p?.badges?.length||0}/${portal?.minBadges})`:""}</button>
            );
          })}
          {zd.pkCenter&&<button onClick={()=>pick("Aller au Centre Pokémon")} style={{...btn("transparent",C.green,C.green,"7px","5px 8px"),width:"100%",marginTop:4}}>🏥 Centre Pokémon</button>}
          {zd.gym&&!p?.badges.includes(zd.gym.badge)&&<button onClick={()=>pick("Défier l'Arène")} style={{...btn("transparent",C.acc,C.acc,"7px","5px 8px"),width:"100%",marginTop:2}}>🏟️ Arène : {zd.gym.leader}</button>}

          <div style={{...ptitle,marginTop:6}}>🏅 BADGES ({p?.badges?.length||0}/{REGIONS[p?.region||"Kanto"]?.totalBadges||8})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {(REGION_BADGES[p?.region||"Kanto"]||[]).map((e,i)=>(
              <span key={i} style={{fontSize:16,opacity:p?.badges.includes(i)?1:0.2,border:`1px solid ${p?.badges.includes(i)?C.acc:C.border}`,padding:"2px 3px"}}>{e}</span>
            ))}
          </div>
        </div>

        {/* CENTER */}
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0,background:"rgba(255,255,255,0.38)"}}>
          {showMap&&(
            <div style={{padding:10,borderBottom:`2px solid ${C.border}`,background:C.panel2,flexShrink:0}}>
              <div style={{fontSize:"7px",color:C.acc,fontFamily:"'Press Start 2P',monospace",marginBottom:6}}>🗺️ CARTE — {regionLabel(p?.region)} (cliquez pour voyager)</div>
              <KantoMap current={currentLoc} region={p?.region||"Kanto"} onSelect={(zone)=>{pick(`Aller à ${zone}`);setShowMap(false);}}/>
            </div>
          )}
          <div ref={narRef} style={{flex:1,overflow:"auto",padding:16,display:"flex",flexDirection:"column",gap:10}}>
            {msgs.map(m=>(
              <div key={m.id} style={{padding:"12px 14px",border:`2px solid ${msgCol[m.type]||C.green}`,borderLeft:`8px solid ${msgCol[m.type]||C.green}`,borderRadius:12,background:msgBg[m.type]||"#e8fff1",marginLeft:m.type==="player"?20:0,animation:"fdIn 0.25s ease",boxShadow:"0 4px 0 rgba(47,95,168,0.10)"}}>
                <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:7,color:msgCol[m.type]||C.green,marginBottom:4}}>{m.label}</div>
                <div style={{lineHeight:1.65,fontSize:13}} dangerouslySetInnerHTML={{__html:safeHtml(m.content)}}/>
              </div>
            ))}
            <style>{`@keyframes fdIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}`}</style>
          </div>
          <div style={{background:C.panel,borderTop:`3px solid ${C.border}`,padding:10,flexShrink:0,boxShadow:"0 -5px 16px rgba(47,95,168,0.13)"}}>
            {choices.length>0&&isMyTurn&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {choices.map((c,i)=>(
                <button key={i} onClick={()=>pick(c)} style={{fontFamily:"'Press Start 2P',monospace",fontSize:"7px",padding:"8px 10px",background:"#ffffff",border:`2px solid ${C.border}`,borderRadius:10,color:C.text,cursor:"pointer",transition:"all 0.15s",lineHeight:1.5,boxShadow:"0 3px 0 rgba(47,95,168,0.15)"}}
                  onMouseEnter={e=>{e.target.style.borderColor=C.acc;e.target.style.color=C.acc;}}
                  onMouseLeave={e=>{e.target.style.borderColor=C.border;e.target.style.color=C.text;}}>
                  {c}
                </button>
              ))}
            </div>}
            {!isMyTurn&&gs?.players.length>1&&<div style={{background:"rgba(59,76,202,0.15)",border:`1px solid ${C.acc2}`,padding:"8px 12px",marginBottom:8,fontFamily:"'Press Start 2P',monospace",fontSize:"7px",color:C.acc2,textAlign:"center"}}>
              ⏳ C'est le tour de {pActive?.name}… Attendez votre tour !
            </div>}
            <div style={{display:"flex",gap:8}}>
              <input value={inp} onChange={e=>isMyTurn&&setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&isMyTurn&&send()} placeholder={isMyTurn?`${p?.name} — Que faites-vous ?`:`⏳ Tour de ${pActive?.name}…`} disabled={!isMyTurn} style={{flex:1,padding:"11px 14px",background:isMyTurn?"#ffffff":"#e6edf7",border:`2px solid ${isMyTurn?C.acc:C.border}`,borderRadius:10,color:isMyTurn?C.text:C.dim,fontFamily:"'Segoe UI',sans-serif",fontSize:13,outline:"none",opacity:isMyTurn?1:0.65}}/>
              <button onClick={send} disabled={!isMyTurn} style={{...btn(isMyTurn?C.acc:"#222",isMyTurn?C.bg:C.dim,isMyTurn?C.acc:C.border,"9px","9px 18px"),opacity:isMyTurn?1:0.4}}>▶ {p?.name}</button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{width:232,flexShrink:0,background:"rgba(248,251,255,0.96)",borderLeft:`3px solid ${C.border}`,overflow:"auto",padding:10,boxShadow:"inset 5px 0 rgba(47,95,168,0.08)"}}>
          <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:10}}>
            {[["players","👥 Joueurs"],["dex","📖 Dex"],["inv","🎒 Sac"]].map(([t,lbl])=>(
              <button key={t} onClick={()=>setTab(t)} style={{flex:1,fontFamily:"'Press Start 2P',monospace",fontSize:"6px",padding:"7px 2px",background:"transparent",border:"none",borderBottom:`2px solid ${tab===t?C.acc:"transparent"}`,color:tab===t?C.acc:C.dim,cursor:"pointer"}}>{lbl}</button>
            ))}
          </div>
          {tab==="players"&&<>
            <div style={ptitle}>Joueurs</div>
            {gs?.players.map((pl,i)=>(
              <div key={i} style={{background:"#ffffff",border:`2px solid rgba(47,95,168,0.22)`,borderRadius:12,padding:8,marginBottom:8,boxShadow:"0 3px 0 rgba(47,95,168,0.12)"}}>
                <div style={{fontSize:11,fontWeight:700,color:C.acc,fontFamily:"'Press Start 2P',monospace",fontSize:8}}>{pl.isMain?"⭐":""} {pl.name}</div>
                <div style={{fontSize:10,color:C.dim,marginTop:3}}>📍 {pl.location||"Bourg Palette"} · 🌍 {regionLabel(pl.region)}</div>
                <div style={{fontSize:10,color:C.dim}}>💰 {pl.money}₽ · 🏅 {pl.badges.length}/{REGIONS[pl.region||"Kanto"]?.totalBadges||8}</div>
                <div style={{display:"flex",gap:3,marginTop:4}}>
                  {pl.team.slice(0,6).map(pk=>(
                    <img key={pk.uid} src={spriteUrl(pk.id,false,pk.shiny)} alt={pk.name} style={{width:24,height:24,imageRendering:"pixelated"}} title={`${pk.shiny?"SHINY ":""}${pk.name} Nv.${pk.level}`} onError={e=>e.target.style.display="none"}/>
                  ))}
                </div>
              </div>
            ))}
          </>}
          {tab==="dex"&&<>
            <div style={ptitle}>Pokédex — {p?.dex.length||0} capturés</div>
            <div style={{display:"flex",flexDirection:"column",gap:3}}>
              {p?.dex.map(id=>{
                const pk=gp(id);
                return <div key={id} style={{display:"flex",alignItems:"center",gap:6,background:"#ffffff",border:`2px solid rgba(47,95,168,0.18)`,borderRadius:10,padding:"4px 7px"}}>
                  <img src={spriteUrl(id)} alt={pk.n} style={{width:28,height:28,imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"}/>
                  <div>
                    <div style={{fontSize:11,fontWeight:700}}>#{id} {pk.n}</div>
                    <div style={{display:"flex",gap:3,marginTop:1}}>
                      {pk.t.map(t=><span key={t} style={{fontSize:8,padding:"1px 4px",background:TYPE_CLR[t]||"#333",color:"white",borderRadius:2}}>{t}</span>)}
                    </div>
                  </div>
                </div>;
              })}
              {!p?.dex.length&&<div style={{fontSize:10,color:C.dim}}>Aucun Pokémon capturé</div>}
            </div>
          </>}
          {tab==="inv"&&<>
            <div style={ptitle}>Inventaire</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
              {ITEMS_DB.map(item=>{
                const count=p?.inventory[item.id]||0;if(!count)return null;
                return <div key={item.id} onClick={()=>useItem(item.id)} title={item.id} style={{background:"#ffffff",border:`2px solid rgba(47,95,168,0.18)`,borderRadius:10,padding:6,textAlign:"center",cursor:"pointer",position:"relative",boxShadow:"0 3px 0 rgba(47,95,168,0.10)"}}>
                  <div style={{fontSize:22}}>{item.e}</div>
                  <div style={{position:"absolute",top:2,right:3,fontSize:8,color:C.acc,fontFamily:"'Press Start 2P',monospace",fontWeight:900}}>×{count}</div>
                  <div style={{fontSize:8,color:C.dim,marginTop:2,lineHeight:1.1}}>{item.n}</div>
                </div>;
              })}
              {p&&!Object.values(p.inventory).some(v=>v>0)&&<div style={{fontSize:10,color:C.dim,gridColumn:"span 3"}}>Sac vide</div>}
            </div>
          </>}
        </div>
      </div>

      {showAddPlayer&&<div style={{position:"fixed",inset:0,background:"rgba(29,43,83,0.62)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(3px)"}}>
        <div style={{background:C.panel,border:`4px solid ${C.acc2}`,borderRadius:18,width:"100%",maxWidth:420,boxShadow:"0 10px 0 rgba(29,43,83,0.22),0 28px 70px rgba(29,43,83,0.4)",overflow:"hidden"}}>
          <div style={{background:C.acc2,padding:"10px 14px",fontFamily:"'Press Start 2P',monospace",fontSize:9,color:"white",textShadow:"1px 1px 0 rgba(36,54,79,0.65)"}}>Ajouter un dresseur</div>
          <div style={{padding:16,display:"flex",flexDirection:"column",gap:10}}>
            <label style={{fontFamily:"'Press Start 2P',monospace",fontSize:7,color:C.dim}}>Nom</label>
            <input value={newPlayerName} maxLength={16} onChange={e=>setNewPlayerName(e.target.value)} placeholder="Ex: Ondine" style={{padding:"10px 12px",background:"#fff",border:`2px solid ${C.border}`,borderRadius:10,color:C.text,fontFamily:"'Press Start 2P',monospace",fontSize:9,outline:"none"}}/>
            <label style={{fontFamily:"'Press Start 2P',monospace",fontSize:7,color:C.dim}}>Starter</label>
            <select value={newPlayerStarter} onChange={e=>setNewPlayerStarter(parseInt(e.target.value,10))} style={{padding:"10px 12px",background:"#fff",border:`2px solid ${C.border}`,borderRadius:10,color:C.text,fontFamily:"'Press Start 2P',monospace",fontSize:8}}>
              {STARTERS.map(s=><option key={s.id} value={s.id}>{s.n}</option>)}
            </select>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:6}}>
              <button onClick={()=>setShowAddPlayer(false)} style={btn("transparent",C.dim,C.border,"8px")}>Annuler</button>
              <button onClick={confirmAddMidPlayer} style={btn(C.acc,C.text,C.acc,"8px")}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>}

      {showQuitConfirm&&<div style={{position:"fixed",inset:0,background:"rgba(29,43,83,0.62)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(3px)"}}>
        <div style={{background:C.panel,border:`4px solid ${C.red}`,borderRadius:18,width:"100%",maxWidth:420,boxShadow:"0 10px 0 rgba(29,43,83,0.22),0 28px 70px rgba(29,43,83,0.4)",overflow:"hidden"}}>
          <div style={{background:C.red,padding:"10px 14px",fontFamily:"'Press Start 2P',monospace",fontSize:9,color:"white",textShadow:"1px 1px 0 rgba(36,54,79,0.65)"}}>Quitter la partie ?</div>
          <div style={{padding:16}}>
            <div style={{fontSize:13,lineHeight:1.6,marginBottom:14}}>La partie est sauvegardée automatiquement, mais tu vas revenir à l'écran titre local.</div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={()=>setShowQuitConfirm(false)} style={btn("transparent",C.dim,C.border,"8px")}>Rester</button>
              <button onClick={()=>{setShowQuitConfirm(false);setScreen("title");}} style={btn(C.red,"white",C.red,"8px")}>Quitter</button>
            </div>
          </div>
        </div>
      </div>}

      {/* COMBAT OVERLAY */}
      {combat&&<div style={{position:"fixed",inset:0,background:"rgba(29,43,83,0.62)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(3px)"}}>
        <div style={{background:C.panel,border:`4px solid ${C.red}`,borderRadius:18,width:"100%",maxWidth:720,boxShadow:"0 8px 0 rgba(36,54,79,0.18),0 24px 58px rgba(36,54,79,0.32)",overflow:"hidden"}}>
          <div style={{background:"linear-gradient(180deg,#c7796d,#b85d4f)",padding:"11px 16px",fontFamily:"'Press Start 2P',monospace",fontSize:9,color:"white",display:"flex",justifyContent:"space-between",alignItems:"center",textShadow:"1px 1px 0 rgba(36,54,79,0.65)"}}>
            <span>⚔ {combat.isTrainer?`DRESSEUR ${combat.tName?.toUpperCase()}`:combat.enemy.leg?"★ LÉGENDAIRE ★":"COMBAT SAUVAGE"}</span>
            <span>Tour {combat.turn}</span>
          </div>
          {/* Battle field */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,padding:16,borderBottom:`2px solid ${C.border}`,background:"linear-gradient(180deg,#c7ddea 0%,#f1f6f6 52%,#cfe2c4 52%,#a8c89f 100%)"}}>
            {/* Player pokemon */}
            <div style={{background:"#ffffff",border:`3px solid ${C.acc2}`,borderRadius:14,padding:12,boxShadow:"0 4px 0 rgba(47,95,168,0.18)"}}>
              <div style={{fontSize:8,color:C.acc2,fontFamily:"'Press Start 2P',monospace",marginBottom:6}}>TON POKÉMON</div>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <img src={spriteUrl(combat.ally.id,true,combat.ally.shiny)} alt={combat.ally.name} style={{width:78,height:78,imageRendering:"pixelated",filter:"drop-shadow(0 8px 0 rgba(29,43,83,0.12))"}} onError={e=>e.target.style.display="none"}/>
                <div>
                  <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:9,color:C.acc,marginBottom:3}}>{combat.ally.shiny?"✨ ":""}{combat.ally.name}</div>
                  <div style={{fontSize:10,color:C.dim,marginBottom:4}}>Nv.{combat.ally.level}</div>
                  <div style={{display:"flex",gap:3}}>
                    {(combat.ally.types||[]).map(t=><span key={t} style={{fontSize:7,padding:"1px 4px",background:TYPE_CLR[t]||"#333",color:"white"}}>{t}</span>)}
                  </div>
                </div>
              </div>
              <div style={{height:6,background:C.border,borderRadius:3}}><div style={{width:`${Math.max(0,combat.ally.hp/combat.ally.maxhp)*100}%`,height:"100%",background:hpCol(combat.ally.hp/combat.ally.maxhp),transition:"width 0.3s",borderRadius:3}}/></div>
              <div style={{fontSize:10,color:C.dim,marginTop:2,textAlign:"right"}}>{combat.ally.hp}/{combat.ally.maxhp} PV</div>
              <div style={{height:2,background:C.border,borderRadius:1,marginTop:3}}><div style={{width:`${Math.min(100,(combat.ally.exp/combat.ally.expN)*100)}%`,height:"100%",background:C.acc2,borderRadius:1}}/></div>
            </div>
            {/* Enemy pokemon */}
            <div style={{background:"#ffffff",border:`3px solid ${C.red}`,borderRadius:14,padding:12,boxShadow:"0 4px 0 rgba(227,53,13,0.18)"}}>
              <div style={{fontSize:8,color:C.red,fontFamily:"'Press Start 2P',monospace",marginBottom:6}}>{combat.isTrainer?"DRESSEUR ADVERSE":"POKÉMON SAUVAGE"}</div>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <img src={spriteUrl(combat.enemy.id,false,combat.enemy.shiny)} alt={combat.enemy.name} style={{width:78,height:78,imageRendering:"pixelated",filter:"drop-shadow(0 8px 0 rgba(29,43,83,0.12))"}} onError={e=>e.target.style.display="none"}/>
                <div>
                  <div style={{fontFamily:"'Press Start 2P',monospace",fontSize:9,color:C.red,marginBottom:3}}>{combat.enemy.shiny?"✨ SHINY ":""}{combat.enemy.name}{combat.enemy.leg?" ✨":""}</div>
                  <div style={{fontSize:10,color:C.dim,marginBottom:4}}>Nv.{combat.enemy.level}</div>
                  <div style={{display:"flex",gap:3}}>
                    {(combat.enemy.types||[]).map(t=><span key={t} style={{fontSize:7,padding:"1px 4px",background:TYPE_CLR[t]||"#333",color:"white"}}>{t}</span>)}
                  </div>
                </div>
              </div>
              <div style={{height:6,background:C.border,borderRadius:3}}><div style={{width:`${Math.max(0,combat.enemy.hp/combat.enemy.maxhp)*100}%`,height:"100%",background:hpCol(combat.enemy.hp/combat.enemy.maxhp),transition:"width 0.3s",borderRadius:3}}/></div>
              <div style={{fontSize:10,color:C.dim,marginTop:2,textAlign:"right"}}>{combat.enemy.hp}/{combat.enemy.maxhp} PV</div>
            </div>
          </div>
          {/* Log */}
          <div style={{padding:"12px 16px",fontFamily:"'Press Start 2P',monospace",fontSize:10,minHeight:44,borderBottom:`2px solid rgba(82,111,143,0.18)`,lineHeight:1.7,color:C.text,background:"#f7efd9"}} dangerouslySetInnerHTML={{__html:safeHtml(combat.log)}}/>
          {/* Actions */}
          <div style={{padding:"10px 12px",display:"flex",flexWrap:"wrap",gap:6}}>
            {combat.ally.moves.map((mv,i)=>(
              <button key={i} onClick={()=>mv.pp>0&&doMove(mv,combat)} style={{flex:"1 1 130px",fontFamily:"'Press Start 2P',monospace",fontSize:"7px",padding:"10px 8px",background:mv.pp>0?"#ffffff":"#e6edf7",border:`2px solid ${mv.pp>0?C.border:"rgba(47,95,168,0.12)"}`,borderRadius:10,color:mv.pp>0?C.text:C.dim,cursor:mv.pp>0?"pointer":"not-allowed",textAlign:"center",lineHeight:1.8,boxShadow:mv.pp>0?"0 3px 0 rgba(47,95,168,0.14)":"none"}}>
                {mv.name}<br/><span style={{fontSize:"6px",color:C.dim}}>PP {mv.pp}/{mv.maxpp}</span>
              </button>
            ))}
            {!combat.isTrainer&&<button onClick={()=>tryCatch(combat)} style={{flex:"1 1 130px",fontFamily:"'Press Start 2P',monospace",fontSize:"7px",padding:"10px 8px",background:"#f7efd9",border:`2px solid ${C.acc}`,borderRadius:10,color:C.border,cursor:"pointer",textAlign:"center",lineHeight:1.8,boxShadow:"0 3px 0 rgba(36,54,79,0.12)"}}>
              🔴 Capturer<br/><span style={{fontSize:"6px",color:C.dim}}>×{Object.entries(gs?.players[combat.ownerPIdx??0]?.inventory||{}).filter(([k])=>k.includes("ball")).reduce((a,[,v])=>a+(v||0),0)}</span>
            </button>}
            {gs?.players[combat.ownerPIdx??0]?.team.filter(pk=>pk.uid!==combat.ally.uid&&pk.hp>0).map((pk,i)=>(
              <button key={i} onClick={()=>setCombat({...combat,ally:pk,log:`Allez <b>${pk.name}</b> !`,turn:combat.turn+1})} style={{flex:"1 1 130px",fontFamily:"'Press Start 2P',monospace",fontSize:"7px",padding:"10px 8px",background:"#ffffff",border:`2px solid ${C.border}`,borderRadius:10,color:C.text,cursor:"pointer",textAlign:"center",lineHeight:1.8,boxShadow:"0 3px 0 rgba(47,95,168,0.14)"}}>
                <img src={spriteUrl(pk.id,false,pk.shiny)} alt="" style={{width:20,height:20,imageRendering:"pixelated",verticalAlign:"middle"}} onError={e=>e.target.style.display="none"}/> {pk.shiny?"✨ ":""}{pk.name}<br/><span style={{fontSize:"6px",color:C.dim}}>Nv.{pk.level}</span>
              </button>
            ))}
            <button onClick={()=>flee(combat)} style={{flex:"1 1 130px",fontFamily:"'Press Start 2P',monospace",fontSize:"7px",padding:"10px 8px",background:"#ffffff",border:`2px solid ${C.red}`,borderRadius:10,color:C.red,cursor:"pointer",textAlign:"center",boxShadow:"0 3px 0 rgba(227,53,13,0.14)"}}>
              🏃 Fuir
            </button>
          </div>
        </div>
      </div>}

      {/* PC OVERLAY */}
      {showPC&&<div style={{position:"fixed",inset:0,background:"rgba(29,43,83,0.62)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(3px)"}}>
        <div style={{background:C.panel,border:`4px solid ${C.acc2}`,borderRadius:18,width:"100%",maxWidth:820,boxShadow:"0 10px 0 rgba(29,43,83,0.22),0 28px 70px rgba(29,43,83,0.4)",overflow:"hidden"}}>
          <div style={{background:C.acc2,padding:"10px 14px",fontFamily:"'Press Start 2P',monospace",fontSize:9,color:"white",display:"flex",justifyContent:"space-between",alignItems:"center",textShadow:"1px 1px 0 rgba(36,54,79,0.65)"}}>
            <span>📦 PC de {p?.name} — {p?.pc.length||0} Pokémon</span>
            <button onClick={()=>setShowPC(false)} style={{background:"transparent",border:"1px solid rgba(255,255,255,0.4)",color:"white",padding:"3px 10px",cursor:"pointer",fontFamily:"'Press Start 2P',monospace",fontSize:8}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:14,gap:14}}>
            <div>
              <div style={ptitle}>Équipe ({p?.team.length}/6)</div>
              {p?.team.map((pk,i)=>(
                <div key={pk.uid} onClick={()=>{setPcSelT(i);setPcSelP(-1);}} style={{display:"flex",alignItems:"center",gap:8,background:"#ffffff",border:`2px solid ${pcSelT===i?C.acc:"rgba(47,95,168,0.22)"}`,borderRadius:10,padding:8,cursor:"pointer",marginBottom:6,boxShadow:"0 3px 0 rgba(47,95,168,0.10)"}}>
                  <img src={spriteUrl(pk.id,false,pk.shiny)} alt={pk.name} style={{width:36,height:36,imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"}/>
                  <div>
                    <div style={{fontSize:12,fontWeight:700}}>{pk.shiny?"✨ ":""}{pk.name}</div>
                    <div style={{fontSize:10,color:C.dim}}>Nv.{pk.level} · {pk.hp}/{pk.maxhp}PV</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={ptitle}>Boîte PC</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:3,maxHeight:260,overflow:"auto"}}>
                {p?.pc.map((pk,i)=>(
                  <div key={pk.uid} onClick={()=>{setPcSelP(i);setPcSelT(-1);}} title={`${pk.name} Nv.${pk.level}`} style={{aspectRatio:"1",background:"#ffffff",border:`2px solid ${pcSelP===i?C.acc:"rgba(47,95,168,0.18)"}`,borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",padding:2}}>
                    <img src={spriteUrl(pk.id,false,pk.shiny)} alt={pk.name} style={{width:"100%",imageRendering:"pixelated"}} onError={e=>e.target.style.display="none"}/>
                    <span style={{fontSize:6,color:C.dim,fontFamily:"'Press Start 2P',monospace"}}>{pk.level}</span>
                  </div>
                ))}
                {Array.from({length:Math.max(0,30-(p?.pc.length||0))}).map((_,i)=>(
                  <div key={"e"+i} style={{aspectRatio:"1",background:"#eef6ff",border:`2px dashed rgba(47,95,168,0.16)`,borderRadius:8}}/>
                ))}
              </div>
            </div>
          </div>
          <div style={{padding:"9px 14px",display:"flex",gap:8,justifyContent:"flex-end",borderTop:`1px solid ${C.border}`,alignItems:"center"}}>
            <span style={{flex:1,fontSize:10,color:C.dim}}>{pcSelT>=0&&pcSelP>=0?"Échange prêt":pcSelT>=0?"→ Choisir un Pokémon du PC":pcSelP>=0?"→ Choisir un Pokémon de l'équipe":"Cliquez pour sélectionner"}</span>
            <button onClick={swapPk} disabled={pcSelT<0&&pcSelP<0} style={{...btn(C.acc2,"white",C.acc2,"8px"),opacity:pcSelT<0&&pcSelP<0?0.4:1}}>⇄ Échanger</button>
            <button onClick={()=>setShowPC(false)} style={btn("transparent",C.acc,C.acc,"8px")}>Fermer</button>
          </div>
        </div>
      </div>}

      {/* SHOP OVERLAY */}
      {showShop&&<div style={{position:"fixed",inset:0,background:"rgba(29,43,83,0.62)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(3px)"}}>
        <div style={{background:C.panel,border:`4px solid ${C.acc}`,borderRadius:18,width:"100%",maxWidth:560,boxShadow:"0 10px 0 rgba(29,43,83,0.22),0 28px 70px rgba(29,43,83,0.4)",overflow:"hidden"}}>
          <div style={{background:C.acc,padding:"10px 14px",fontFamily:"'Press Start 2P',monospace",fontSize:9,color:C.text,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span>🏪 MAGASIN — {p?.money.toLocaleString()}₽ ({p?.name})</span>
            <button onClick={()=>setShowShop(false)} style={{background:"transparent",border:"1px solid rgba(0,0,0,0.3)",color:C.bg,padding:"3px 10px",cursor:"pointer",fontFamily:"'Press Start 2P',monospace",fontSize:8}}>✕</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,padding:14,maxHeight:440,overflow:"auto"}}>
            {ITEMS_DB.filter(i=>i.p>0&&i.p<99999).map(item=>(
              <div key={item.id} style={{background:"#ffffff",border:`2px solid rgba(47,95,168,0.22)`,borderRadius:12,padding:10,boxShadow:"0 3px 0 rgba(47,95,168,0.10)"}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:24}}>{item.e}</span>
                  <div><div style={{fontSize:12,fontWeight:700}}>{item.n}</div><div style={{fontSize:10,color:C.dim}}>{item.id==="pokeball"?"Ball standard":item.id==="superball"?"Meilleure efficacité":item.id==="hyperball"?"Très efficace":item.id==="potion"?"Restaure 20 PV":item.id==="superpotion"?"Restaure 50 PV":item.id==="hyperpotion"?"Restaure 200 PV":item.id==="fullrestore"?"Restaure tout":item.id==="revive"?"Ranime un K.O.":"Objet"}</div></div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:C.acc,fontWeight:700,fontFamily:"'Press Start 2P',monospace",fontSize:9}}>{item.p.toLocaleString()}₽</span>
                  <button onClick={()=>buyItem(item.id)} style={btn("transparent",C.acc,C.acc,"7px","5px 10px")}>Acheter</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}
    </div>
  );
}
