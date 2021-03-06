/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';
import { TPromise } from 'vs/base/common/winjs.base';
import { ITree } from 'vs/base/parts/tree/browser/tree';
import { ContributableActionProvider } from 'vs/workbench/browser/actions';
import { IAction } from 'vs/base/common/actions';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { TaskNode, TaskStatus, TaskExecutionMode } from 'sql/parts/taskHistory/common/taskNode';
import { CancelAction, ScriptAction } from 'sql/parts/taskHistory/viewlet/taskAction';

/**
 *  Provides actions for the history tasks
 */
export class TaskHistoryActionProvider extends ContributableActionProvider {

	constructor(
		@IInstantiationService private _instantiationService: IInstantiationService
	) {
		super();
	}

	public hasActions(tree: ITree, element: any): boolean {
		return element instanceof TaskNode;
	}

	/**
	 * Return actions given an element in the tree
	 */
	public getActions(tree: ITree, element: any): TPromise<IAction[]> {
		if (element instanceof TaskNode) {
			return TPromise.as(this.getTaskHistoryActions(tree, element));
		}
		return TPromise.as([]);
	}

	public hasSecondaryActions(tree: ITree, element: any): boolean {
		return false;
	}

	public getSecondaryActions(tree: ITree, element: any): TPromise<IAction[]> {
		return super.getSecondaryActions(tree, element);
	}

	/**
	 * Return actions for history task
	 */
	public getTaskHistoryActions(tree: ITree, element: TaskNode): IAction[] {
		var actions = [];

		// get actions for tasks in progress
		if (element.status === TaskStatus.inProgress && element.isCancelable) {
			actions.push(this._instantiationService.createInstance(CancelAction, CancelAction.ID, CancelAction.LABEL));
		}

		// get actions for tasks succeeded
		if (element.status === TaskStatus.succeeded || element.status === TaskStatus.succeededWithWarning) {
			if (element.taskExecutionMode === TaskExecutionMode.executeAndScript) {
				actions.push(this._instantiationService.createInstance(ScriptAction, ScriptAction.ID, ScriptAction.LABEL));
			}
		}

		return actions;
	}
}