/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/cambiarEstado.js":
/*!*********************************!*\
  !*** ./src/js/cambiarEstado.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado');\r\n    const token = document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content');\r\n\r\n    cambiarEstadoBotones.forEach(boton => {\r\n        boton.addEventListener('click', cambiarEstadoPropiedad)\r\n    })\r\n\r\n    async function cambiarEstadoPropiedad(e){\r\n\r\n        const {propiedadId: id} = e.target.dataset;\r\n        \r\n        try {\r\n            const url = `/propiedades/${id}`;\r\n            const respuesta = await fetch(url, {\r\n                method: 'PUT',\r\n                headers: {\r\n                    'CSRF-Token': token\r\n                }\r\n            })\r\n\r\n            const {resultado} = await respuesta.json();\r\n            \r\n            if(resultado){\r\n                if(e.target.classList.contains('bg-gray-100')){\r\n                    e.target.classList.add('bg-green-100', 'text-green-600');\r\n                    e.target.classList.remove('bg-gray-100', 'text-gray-700');\r\n                    e.target.textContent = 'Publicado';\r\n                }else{\r\n                    e.target.classList.remove('bg-green-100', 'text-green-600');\r\n                    e.target.classList.add('bg-gray-100', 'text-gray-700');\r\n                    e.target.textContent = 'No Publicado';\r\n                }\r\n                \r\n            }\r\n        } catch (error) {\r\n            console.log(error);\r\n        }\r\n    }\r\n})()\n\n//# sourceURL=webpack://bienesraices/./src/js/cambiarEstado.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/cambiarEstado.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;