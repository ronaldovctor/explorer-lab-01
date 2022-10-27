import './css/index.css'
import IMask from 'imask'

const $ = (selector) => document.querySelector(selector)

const ccBgColor01 = $('.cc-bg svg > g g:nth-child(1) path')
const ccBgColor02 = $('.cc-bg svg > g g:nth-child(2) path')
const ccLogo = $('.cc-logo span:nth-child(2) img')

const cards = {
	visa: 'visa',
	mastercard: 'mastercard',
	default: 'default',
}

const masks = {
	securityCode: {
		mask: '0000',
	},
	expirationDate: {
		mask: 'MM{/}YY',
		blocks: {
			MM: {
				mask: IMask.MaskedRange,
				from: 1,
				to: 12,
			},
			YY: {
				mask: IMask.MaskedRange,
				from: String(new Date().getFullYear()).slice(2),
				to: String(new Date().getFullYear() + 10).slice(2),
			},
		},
	},
}

function setCardType(type) {
	const colors = {
		visa: ['#436D99', '#2D57F2'],
		mastercard: ['#DF6F29', '#C69347'],
		default: ['black', 'gray'],
	}

	ccBgColor01.setAttribute('fill', colors[type][0])
	ccBgColor02.setAttribute('fill', colors[type][1])
	ccLogo.setAttribute('src', `cc-${type}.svg`)
}

setCardType(cards.mastercard)

const securityCode = $('#security-code')
const securityCodePattern = masks.securityCode
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = $('#expiration-date')
const expirationDatePattern = masks.expirationDate
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = $('#card-number')

const cardNumberPattern = {
	mask: [
		{
			mask: '0000 0000 0000 0000',
			regex: /^4\d{0,15}/,
			cardtype: 'visa',
		},
		{
			mask: '0000 0000 0000 0000',
			regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7])\d{0,12}/,
			cardtype: 'mastercard',
		},
		{
			mask: '0000 0000 0000 0000',
			cardtype: 'default',
		},
	],
	dispatch: function (appended, dynamicMasked) {
		const number = (dynamicMasked.value + appended).replace(/\D/g, '')
		const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
			number.match(regex)
		)
		return foundMask
	},
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = $('#add-card')
addButton.addEventListener('click', () => {})

const formCard = $('#card-form')
formCard.addEventListener('submit', (event) => {
	event.preventDefault()
})

const cardHolder = $('#card-holder')
cardHolder.addEventListener('input', ({ target }) => {
	const ccHolder = $('.cc-holder .value')
	ccHolder.innerText = target.value || 'FULANO DA SILVA'
})

securityCodeMasked.on('accept', () => {
	updateSecurityCodeMasked(securityCodeMasked.value)
})

function updateSecurityCodeMasked(code) {
	const ccSecurity = $('.cc-security .value')
	ccSecurity.innerText = code || '123'
}

cardNumberMasked.on('accept', () => {
	updateCardNumberMasked(cardNumberMasked.value)
})

function updateCardNumberMasked(code) {
	const ccNumber = $('.cc-number')
	ccNumber.innerText = code || '1234 5678 9012 3456'

	const cardType = cardNumberMasked.masked.currentMask.cardtype
	setCardType(cardType)
}

expirationDateMasked.on('accept', () => {
	updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
	const ccExpiration = $('.cc-extra .value')
	ccExpiration.innerText = date || '02/32'
}
