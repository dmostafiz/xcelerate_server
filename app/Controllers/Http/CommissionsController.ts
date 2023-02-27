import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { logMe } from 'App/Helpers'

export default class CommissionsController {

    public matrixLevels = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
    public matrixMatchLevels = [50, 10, 10, 5, 5];

    public async calculate({ request }: HttpContextContract) {

        const salePrice = request.input('price')
        const subscriptions = request.input('subscriptions')

        try {


            const matrixCommissions = this.matrixLevels.map((level, i) => {
                return {
                    level: `Level ${i + 1}`,
                    percentage: level,
                    commission: ((salePrice * level) / 100),
                    matchMatchCommission: (((salePrice * level) / 100) + this.calculateMatch(
                        ((salePrice * level) / 100),
                        i,
                        this.matrixMatchLevels
                    ) * subscriptions)
                    // ((salePrice * level) / 100)
                }
            })



            const matrixMatchCommissions = this.matrixLevels.map((level, i) => {
                return {
                    level: `Level ${i + 1}`,
                    percentage: this.matrixMatchLevels[level],
                    commission: (this.calculateMatch(
                        ((salePrice * level) / 100),
                        i,
                        this.matrixMatchLevels
                    ) * subscriptions)
                    // ((salePrice * level) / 100)
                }
            })

            return { ok: true, commissions: { matrix: matrixCommissions, match: matrixMatchCommissions } }

        } catch (error) {
            logMe('Commission Calculation error', error)
            return { ok: false }
        }

    }


    public calculateMatch(matrixValue: number, i: number, matchLevels: number[]) {

        var commission = 0

        for (var x = 0; x < i; x++) {
            commission += matchLevels[x] ? (matchLevels[x] * matrixValue / 100) : 0
        }

        return commission
    }

}
