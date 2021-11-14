import { storiesOf } from '@storybook/vue';
import { i18n } from '@/test/i18n';
import ComponentDocs from '@/assets/design-system/docs/components/ComponentDocs.vue';
import VueDropdown from '@/components/input-and-actions/VueDropdown/VueDropdown.vue';
import VueColumns from '@/components/layout/VueColumns/VueColumns.vue';
import VueColumn from '@/components/layout/VueColumns/VueColumn/VueColumn.vue';
import VueText from '@/components/typography/VueText/VueText.vue';
import VueAvatar from '@/components/data-display/VueAvatar/VueAvatar.vue';
import VueInput from '@/components/input-and-actions/VueInput/VueInput.vue';
import VueToggle from '@/components/input-and-actions/VueToggle/VueToggle.vue';
import VueSelect from '@/components/input-and-actions/VueSelect/VueSelect.vue';
import VueBadge from '@/components/data-display/VueBadge/VueBadge.vue';
import VueBox from '@/components/layout/VueBox/VueBox.vue';
import VueButton from '@/components/input-and-actions/VueButton/VueButton.vue';
import { sleep } from '@/test/test-utils';
import { dataTableRecordsFixture, dataTableColumnsFixture } from './DataTableFixtures';
import VueDataTable from './VueDataTable.vue';

const story = storiesOf('Vuesion+|DataTable', module) as any;

story.add(
  'Inline editing',
  () => ({
    i18n,
    components: {
      VueDataTable,
      VueDropdown,
      ComponentDocs,
      VueColumns,
      VueColumn,
      VueText,
      VueAvatar,
      VueInput,
      VueToggle,
      VueSelect,
      VueBadge,
      VueBox,
      VueButton,
    },
    data(): any {
      return {
        columns: dataTableColumnsFixture(),
        records: dataTableRecordsFixture(),
        currentId: null,
        name: null,
        age: null,
        address: null,
        status: null,
        created: null,
        updated: null,
        isLoading: false,
      };
    },
    template: `
      <component-docs
        story="Make an individual row editable by pressing the edit action and update the record on save."
      >
      <vue-stack>
        <vue-data-table
          id="table1"
          primary-key="id"
          title="Users"
          :is-loading="isLoading"
          :columns="columns"
          :records="records"
        >

          <template v-slot:row="{ row }">
            <template v-if="currentId === row.id">
              <td>
                <vue-input autofocus label="name" name="name" id="name" hide-label hide-description v-model="name" />
              </td>
              <td>
                <vue-input label="age" name="age" id="age" hide-label hide-description v-model="age" />
              </td>
              <td>
                <vue-input label="address" name="address" id="address" hide-label hide-description v-model="address" />
              </td>
              <td>
                <vue-select
                  :items="[
                      { label: 'New', value: 'new' },
                      { label: 'Pending', value: 'pending' },
                      { label: 'Blocked', value: 'blocked' },
                      { label: 'Registered', value: 'registered' },
                  ]"
                  label="status"
                  name="status"
                  id="status"
                  hide-label
                  hide-description
                  :value="status"
                  @input="status = $event.value"
                />
              </td>
              <td>
                <vue-input label="created" name="created" id="created" type="date" hide-label hide-description v-model="created" />
              </td>
              <td>
                <vue-input label="updated" name="updated" id="updated" type="date" hide-label hide-description v-model="updated" />
              </td>
              <td><vue-button look="primary" leading-icon="save" @click="onSave">Save</vue-button></td>
            </template>
            <template v-else>
              <td>
                <vue-columns space="12" align-y="center">
                  <vue-column width="content">
                    <vue-avatar :name="row.firstname + ' ' + row.lastname" size="md" :src="row.avatar"/>
                  </vue-column>
                  <vue-column>
                    <vue-text weight="semi-bold" as="div">{{ row.firstname }} {{ row.lastname }}</vue-text>
                    <vue-text color="text-low">ID: {{ row.id }}</vue-text>
                  </vue-column>
                </vue-columns>
              </td>
              <td>{{row.age}}</td>
              <td>{{row.address}}</td>
              <td>
                <vue-badge v-if="row.status === 'new'" status="success">New</vue-badge>
                <vue-badge v-else-if="row.status === 'pending'" status="warning">Pending</vue-badge>
                <vue-badge v-else-if="row.status === 'blocked'" status="danger">Blocked</vue-badge>
                <vue-badge v-else-if="row.status === 'registered'" status="info">Registered</vue-badge>
              </td>
              <td>{{ $d(row.created, 'dayMonthYearNumeric', 'de') }}</td>
              <td>{{ $d(row.updated, 'dayMonthYearNumeric', 'de') }}</td>
              <td>
                <vue-dropdown
                  button-text="Select"
                  :items="[{label:'Edit', value:'edit'}]"
                  align-menu="right"
                  @item-click="onEdit(row)"/>
              </td>
            </template>
          </template>

          <template slot="empty-state">
            <vue-box padding="32" align="center">
              No Results found!
            </vue-box>
          </template>
        </vue-data-table>
      </vue-stack>
      </component-docs>`,
    methods: {
      onEdit(record: any) {
        this.currentId = record.id;
        this.name = record.firstname + ' ' + record.lastname;
        this.age = record.age;
        this.address = record.address;
        this.status = record.status;
        this.created = new Date(record.created).toJSON().substr(0, 10);
        this.updated = new Date(record.updated).toJSON().substr(0, 10);
      },
      async onSave() {
        this.isLoading = true;

        const recordIndex = this.records.findIndex((record: any) => record.id === this.currentId);
        const record = this.records[recordIndex];
        const [firstname, lastname] = this.name.split(' ');

        record.firstname = firstname;
        record.lastname = lastname;
        record.age = this.age;
        record.address = this.address;
        record.status = this.status;
        record.created = new Date(this.created).getTime();
        record.updated = new Date(this.updated).getTime();

        await sleep(800);

        this.records.splice(recordIndex, 1, record);

        /* save record and reset local model */
        this.currentId = null;
        this.name = null;
        this.age = null;
        this.address = null;
        this.status = null;
        this.created = null;
        this.updated = null;

        this.isLoading = false;
      },
    },
  }),
  {
    info: {
      components: { VueDataTable },
    },
  },
);
