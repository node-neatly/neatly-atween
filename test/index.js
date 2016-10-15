'use strict';


const Code = require('code');
const expect = Code.expect;
const neatly = require('neatly');
const driller = require('neatly-driller')(neatly);


const mod = require('../');
const init = driller.wrap(mod);


describe('neatly-atween', () => {

	describe('$atweenProvider', () => {

		let $atweenProvider;
		beforeEach(() => init(['$atweenProvider', (provider) => $atweenProvider = provider]));

		it('should have method registerHook()', () =>
			expect($atweenProvider.registerHook).to.be.a.function()
		);

		it('should have method registerInterceptor()', () =>
			expect($atweenProvider.registerInterceptor).to.be.a.function()
		);

		it('should have method registerEvent()', () =>
			expect($atweenProvider.registerEvent).to.be.a.function()
		);

	});


	describe('$atween (service)', () => {

		let $atween;
		beforeEach(() => init().start().then((app) => $atween = app.get('$atween')));

		it('should have method runHooks()', () =>
			expect($atween.runHooks).to.be.a.function()
		);

		it('should have method runInterceptors()', () =>
			expect($atween.runInterceptors).to.be.a.function()
		);

		it('should have method runEvents()', () =>
			expect($atween.runEvents).to.be.a.function()
		);

	});












	describe('Hooks', () => {

		it('should be injected with expected values', () => {

			return init(($atweenProvider) => $atweenProvider.registerHook('test', function($hook) {
				expect($hook).to.be.an.object();
				expect($hook).to.equal({
					input: 1,
					results: {}
				});
			}))
			.start()
			.then((app) => app.get('$atween'))
			.then(($atween) => $atween.runHooks('test', 1))
			.then((res) => expect(res).to.equal({}));

		});


		it('should be executed in correct order and with expected injected values', () => {

			return init(($atweenProvider) => {

				$atweenProvider
					.registerHook('test', {
						name: 'A',
						handler: function($hook) {
							expect($hook).to.be.an.object();
							expect($hook).to.equal({
								input: 1,
								results: {}
							});

							return 1;
						}
					})
					.registerHook('test', {
						name: 'B',
						handler: function($hook) {
							expect($hook).to.be.an.object();
							expect($hook).to.equal({
								input: 1,
								results: {
									A: 1
								}
							});

							return 2;
						}
					});

			})
			.start()
			.then((app) => app.get('$atween'))
			.then(($atween) => $atween.runHooks('test', 1))
			.then((res) => expect(res).to.equal({
				A: 1,
				B: 2
			}));

		});



		it('should be executed in correct order and with expected injected values (with priority)', () => {

			return init(($atweenProvider) => {

				$atweenProvider
					.registerHook('test', {
						name: 'A',
						priority: 1500,
						handler: function($hook) {
							expect($hook).to.be.an.object();
							expect($hook).to.equal({
								input: 1,
								results: {
									B: 2
								}
							});

							return 1;
						}
					})
					.registerHook('test', {
						name: 'B',
						handler: function($hook) {
							expect($hook).to.be.an.object();
							expect($hook).to.equal({
								input: 1,
								results: {}
							});

							return 2;
						}
					});

			})
			.start()
			.then((app) => app.get('$atween'))
			.then(($atween) => $atween.runHooks('test', 1))
			.then((res) => expect(res).to.equal({
				A: 1,
				B: 2
			}));

		});


	});



	describe('Interceptors', () => {

		it('should be injected with expected values', () => {

			return init(($atweenProvider) => $atweenProvider.registerInterceptor('test', function($interceptor) {
				expect($interceptor).to.be.an.object();
				expect($interceptor).to.equal({
					input: 1,
					originalInput: 1
				});

				return $interceptor.input * 2;
			}))
			.start()
			.then((app) => app.get('$atween'))
			.then(($atween) => $atween.runInterceptors('test', 1))
			.then((res) => expect(res).to.equal(2));

		});



		it('should be executed in correct order and with expected injected values', () => {

			return init(($atweenProvider) => {

				$atweenProvider
					.registerInterceptor('test', function($interceptor) {

						expect($interceptor).to.be.an.object();
						expect($interceptor).to.equal({
							input: 1,
							originalInput: 1
						});

						return $interceptor.input * 2;
					})
					.registerInterceptor('test', function($interceptor) {

						expect($interceptor).to.be.an.object();
						expect($interceptor).to.equal({
							input: 2,
							originalInput: 1
						});

						return $interceptor.input * 2;
					});

			})
			.start()
			.then((app) => app.get('$atween'))
			.then(($atween) => $atween.runInterceptors('test', 1))
			.then((res) => expect(res).to.equal(4));

		});



		it('should be executed in correct order and with expected injected values (with priority)', () => {

			return init(($atweenProvider) => {

				$atweenProvider
					.registerInterceptor('test', function($interceptor) {

						expect($interceptor).to.be.an.object();
						expect($interceptor).to.equal({
							input: 2,
							originalInput: 1
						});

						return $interceptor.input * 2;
					})
					.registerInterceptor('test', {
						priority: 500,
						handler: function($interceptor) {

							expect($interceptor).to.be.an.object();
							expect($interceptor).to.equal({
								input: 1,
								originalInput: 1
							});

							return $interceptor.input * 2;
						}
					});

			})
			.start()
			.then((app) => app.get('$atween'))
			.then(($atween) => $atween.runInterceptors('test', 1))
			.then((res) => expect(res).to.equal(4));

		});


	});



});
