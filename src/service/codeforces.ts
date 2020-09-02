import fetch from 'node-fetch';
import { ICFUserInfo } from '../base/types';


class Codeforces {

    public static colors: { [key: string]: string } = {
        'newbie': '#808080',
        'pupil': '#008000',
        'specialist': '#03a89e',
        'expert': '#0000ff',
        'candidate master': '#aa00aa',
        'master': '#ff8c00',
        'international Master': '#ff8c00',
        'grandmaster': '#ff0000',
        'international grandmaster': '#ff0000',
        'legendary grandmaster': '#ff0000'
    };

    public static async getUserInfo(handle: string): Promise<ICFUserInfo> {
        const data = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`).then(res => res.json());

        if (data.status !== 'OK') {
            throw `Server Error: Could not found user: ${handle}.`;
        }

        const result = data.result[0];
        const user: ICFUserInfo = {
            name: `${result.firstName} ${result.lastName}`,
            handle: handle,
            rank: result.rank,
            maxRank: result.maxRank,
            rating: result.rating,
            maxRating: result.maxRating,
            iconURL: `https:${result.avatar}`,
            colorCode: this.colors[result.rank],
            link: `https://codeforces.com/profile/${handle}`
        };

        return user;
    }

    public static async getRandomProblem(tag = 'math'): Promise<[string, string, string]> {
        const data = await fetch(`https://codeforces.com/api/problemset.problems?tags=${tag}`).then(res => res.json());

        if (data.status !== 'OK') {
            throw 'Server Error: Could not found problem.';
        }

        if (data.result.problems.length < 1) {
            throw `There is no problem with tag: ${tag}.`;
        }

        const random = Math.floor(Math.random() * data.result.problems.length);
        const problem = data.result.problems[random];

        return [problem.contestId, problem.index, `https://codeforces.com/contest/${problem.contestId}/problem/${problem.index}`];
    }

    public static async getLatestSubmissionDate(handle: string, contestId: string, index: string): Promise<Date> {
        const data = await fetch(`https://codeforces.com/api/user.status?handle=${handle}&from=1&count=100`).then(res => res.json());

        if (data.status !== 'OK') {
            throw 'Server Error: Could not fetch status of user.';
        }

        const status = data.result.find((res: any) => {
            // eslint-disable-next-line eqeqeq
            return res.problem.contestId == contestId && res.problem.index == index;
        });

        if (!status) {
            throw `Could not find submission for contest: ${contestId}, index: ${index} of user ${handle}`;
        }

        return new Date(status.creationTimeSeconds * 1000);
    }
}

export = Codeforces;
