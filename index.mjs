import {clear, log} from "console"
import { stdin, stdout } from "process"
import moment from "moment"

var sleep = ms => new Promise(r => setTimeout(r, ms)),
	FMT = "DD/MM/YYYY HH:mm:ss.SSS",
	LABEL_PAD = 25,
	labelPad = t => t.padEnd(LABEL_PAD, " "),
	startedAt = moment(),
	lastAnswer = moment(),
    showSince = /** @param {moment.Moment} a @param {moment.Moment} b */ function(a,b){
        let ab_diff = Math.abs(a.diff(b,"ms")),
            ab_diff_utc = moment.utc(ab_diff),
            ab_diff_dayPart = ab_diff_utc.dayOfYear() - 1,
            ab_diff_yearPart = (ab_diff_utc.year() - 1970),
            ab_diff_form = ab_diff_utc.format(`[${ab_diff_yearPart}][y] [${ab_diff_dayPart}][d] HH[h] mm[m] ss[s] SSS[ms]`),
            matches_tries = 0

        while(ab_diff_form.match(/^0+[a-z] /)){
            if(++matches_tries>5) break;
            ab_diff_form = ab_diff_form.replace(/^0+[a-z] /, "")
        }
        return ab_diff_form
    },
	onStdinData = function(data){
		if([3,4].includes(data[0])){
			log("Saindo...")
			stdin.setRawMode(false)
			process.exit()
		}
		log("Gravando última resposta...")
		lastAnswer = moment()
	}

stdin.setRawMode(true).on("data", onStdinData)

while(1){
    stdout.write("\x1B[H\x1B[2J\x1B[3J\x1B[1J")
    log(labelPad("Início do cronômetro:"), startedAt.format(FMT))
    log(labelPad("Última atividade:"), lastAnswer.format(FMT))
    log(labelPad("Início do cronômetro há:"), showSince(lastAnswer, startedAt))
    log(labelPad("Última atividade há:"), showSince(moment(), lastAnswer))
    log("")
    log("Pressione qualquer tecla para registrar atividade,")
    log(" ou pressione Ctrl+C para sair.")
    await sleep(1000/15)
}
