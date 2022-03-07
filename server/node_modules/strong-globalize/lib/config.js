"use strict";
// Copyright IBM Corp. 2018,2020. All Rights Reserved.
// Node module: strong-globalize
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRONGLOOP_GLB = void 0;
exports.STRONGLOOP_GLB = {
    reset() {
        // tslint:disable:no-invalid-this
        const keys = Object.keys(this).filter((k) => k !== 'reset');
        keys.forEach((k) => {
            // Clean up all properties except `reset`
            delete this[k];
        });
    },
};
//# sourceMappingURL=config.js.map