//
// semver is a semantic version number TypeScript module.
//
// Authors R. S. Doiel, <rsdoiel@caltech.edu>
//
// Copyright (c) 2025, Caltech
// All rights not granted herein are expressly reserved by Caltech.
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

export interface SemverInterface {
	// major version number (required, must be an integer as string)
	major: string,
	// minor version number (required, must be an integer as string)
	minor: string,
	// match level (optional, must be an integer as string)
	patch?: string | undefined,
	// suffix string, (optional, any string)
	suffix?: string | undefined,
	// toString assembles the semver into a period delimited string
	toString: () => string
}

// Semver holds the information to generate a semver string
export class Semver implements SemverInterface {
	// major version number (required, must be an integer as string)
	major: string = '';
	// minor version number (required, must be an integer as string)
	minor: string = '';
	// patch level (optional, must be an integer as string)
	patch?: string = '';
	// suffix string, (optional, any string)
	suffix?: string = '';

	// parse takes a byte slice and returns a version struct,
	// and an error value.
	//
	// ```
	//   let sv = new Semver();
	//   let version = "1.0.3"
	//   if (sv.parse(version) === false) {
	//      console.log(`version string failed, ${version}`);
	//      ...
	//   }
	// ```
	//
	parse(s: string): boolean {
		let o: {[key: string] : number | string | undefined} = {};
		const reDash = new RegExp('-','g');
		const reBadAlpha = new RegExp('^[a-uw-zA-UW-Z]+', 'g');
		let p1 = s.split('.');
		if (p1.length < 2) return false;
		o.major = p1[0].trim();
		o.minor = p1[1].trim();
		if (p1.length == 3) {
			if (reDash.test(p1[2])) {
				let p2: string[] = p1[2].split('-', 2);
				o.patch = p2.shift();
				o.suffix = p2.shift();
			} else {
				o.patch = p1[2].trim();
			}
		}
		// Make sure major and minor are numbers only.
		if (reBadAlpha.test(o.major)) return false;
		return this.fromObject(o);
	}

	fromObject(obj: {[key: string]: number | string | undefined}): boolean {
		if (obj['major'] === undefined) return false;
		if (obj['minor'] === undefined) return false;
		this.major = `${obj['major']}`;
		this.minor = `${obj['minor']}`;
		if (obj['patch'] === undefined) {
			this.patch = undefined;
		} else {
			this.patch = `${obj['patch']}`;
		} 
		if (obj['suffix'] === undefined) {
			this.suffix = undefined;
		} else {
			this.suffix = `${obj['suffix']}`;
		}
		return true;
	}
	
	// toString, return a Semver object decoded as string.
	//
	// ```
	//   let sv = new Semver();
	//   sv.Major = "1";
	//   sv.Minor = "0";
	//   sv.Patch = "3";
	//   console.log(`display semver 1.0.3 -> "${sv.toString()}"\n`);
	// ```
	//
	toString(): string {
		let parts: string[] = [];
		if (this.major !== "") {
			parts.push(this.major);
		}
		if (this.minor !== "") {
			parts.push(this.minor);
		}
		if (this.patch !== undefined && this.patch !== "") {
			parts.push(this.patch);
		}
		if (this.suffix !== undefined && this.suffix !== "") {
			return parts.join('.') + '-' + this.suffix;
		}
		return parts.join('.');
	}

	toObject(): {[key: string]: number | string | undefined} {
		let obj: {[key: string]: string | number } = {
			"major": this.major,
			"minor": this.minor,
		}
		if (this.patch !== undefined) {
			obj["patch"] = this.patch;
		}
		if (this.suffix !== undefined) {
			obj['suffix'] = this.suffix;
		}
		return obj;
	}

	// ToJSON takes a version struct and returns JSON as byte slice
	//
	// ```
	//   let sv = new Semver();
	//   sv.major = "1";
	//   sv.minor = "0";
	//   sv.patch = "3";
	//   console.log(`JSON semver -> ${sv.toJSON()}`);
	// ```
	//
	asJSON(): string {
		return JSON.stringify(this.toObject());
	}

	asArray(): string[] {
		let a: string[] = [ this.major, this.minor ];
		if (this.patch !== undefined) {
			a.push(this.patch)
		}
		if (this.suffix !== undefined) {
			a.push(this.suffix)
		}
		return a;
	}

	getMajor(): number {
		return (new Number(this.major)).valueOf();
	}

	getMinor(): number {
		return (new Number(this.minor)).valueOf();
	}

	getPatch(): number {
		const patch = (new Number(this.patch)).valueOf();
		if (isNaN(patch)) {
			return -1;
		}
		return patch;		
	}

	// IncMajor increments a major version number, zeros minor
	// and patch values. Returns an error if increment fails.
	//
	// ```
	//   version := []byte("1.0.3")
	//   sv, err := semver.Parse(version)
	//   if err != nil {
	//      ...
	//   }
	//   sv.IncMajor()
	//   fmt.Printf("display 2.0.0 -> %q\n", sv.String())
	// ```
	//
	incMajor(val?: number): number {
		let major = this.getMajor();
		if (val === undefined) {
			val = 1;
		}
		this.major = `${major + val}`;
		return (major + val);
	}

	// IncMinor increments a minor version number and zeros the
	// patch level or returns an error. Returns an error if increment fails.
	//
	// ```
	//   version := []byte("1.0.3")
	//   sv, err := semver.Parse(version)
	//   if err != nil {
	//      ...
	//   }
	//   sv.IncMinor()
	//   fmt.Printf("display 1.1.0 -> %q\n", sv.String())
	// ```
	//
	incMinor(val?: number): number {
		let minor = this.getMinor();
		if (val === undefined) {
			val = 1;
		}
		this.minor = `${minor + val}`;
		return (minor + val);
	}

	// IncPatch increments the patch level if it is numeric
	// or returns an error.
	//
	// ```
	//   let version = "1.0.3";
	//   let sv = new Semver();
	//   if (sv.parse(version) === false) {
	//      // handles failed parse
	//      ...
	//   }
	//   sv.incPatch()
	//   console.log(`display 1.0.4 -> ${sv.toString()}`);
	// ```
	//
	incPatch(val?: number): number {
		let patch = this.getPatch();
		if (val === undefined) {
			val = 1;
		}
		this.patch = `${patch + val}`;
		return (patch + val);
	}
}

// NewSemver takes a major number, minor number, patch number
// and suffix string and returns a populated Semver.
//
// ```
//    let sv = NewSemver(0, 0, 1, "-alpha");
//    console.log(`Version is now ${sv.toString()}`);
// ```
//
export function NewSemver(major: number, minor: number, patch: string | number, suffix?: string): Semver {
	let version: Semver = new Semver();
	version.major = `${major}`;
	version.minor = `${minor}`;
	version.patch = `${patch}`;
	if (suffix === undefined && suffix !== "") {
		version.suffix = suffix;
	}
	return version;
}
