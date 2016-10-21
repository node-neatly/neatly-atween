'use strict';

const neatly = require('neatly');
const Atween = require('atween');


const mod = module.exports = neatly.module('neatly-atween', []);



mod.provider('$atween', function() {

	const atween = new Atween();

	this.registerHook = atween.registerHook.bind(atween);
	this.registerInterceptor = atween.registerInterceptor.bind(atween);
	this.registerEvent = atween.registerEvent.bind(atween);



	this.$get = function($injector) {

		return {

			registerHook: atween.registerHook.bind(atween),
			registerInterceptor: atween.registerInterceptor.bind(atween),
			registerEvent: atween.registerEvent.bind(atween),


			/**
			 * Wrapper for atween.runHooks with neatly invoker
			 * @param  {[type]} name  [description]
			 * @param  {[type]} input [description]
			 * @param  {[type]} self  [description]
			 * @return {[type]}       [description]
			 */
			runHooks: function(name, input, self) {
				return atween.runHooks(name, input, self, function(handler, input, results, self) {
					return $injector.invoke(handler, self, {
						$hook: {
							input: input,
							results: results
						}
					});
				});
			},


			/**
			 * Wrapper for atween.runInterceptors with neatly invoker
			 * @param  {[type]} name  [description]
			 * @param  {[type]} input [description]
			 * @param  {[type]} self  [description]
			 * @return {[type]}       [description]
			 */
			runInterceptors: function(name, input, self) {
				return atween.runInterceptors(name, input, self, function(handler, input, originalInput, self) {
					return $injector.invoke(handler, self, {
						$interceptor: {
							input: input,
							originalInput: originalInput
						}
					});
				});
			},


			/**
			 * Bind atween.runEvents to $atween-service
			 * @type {[type]}
			 */
			runEvents: atween.runEvents.bind(atween)


		};

	};

});
